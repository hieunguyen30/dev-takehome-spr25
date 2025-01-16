/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { InvalidInputError } from "@/lib/errors/inputExceptions";
import { RequestStatus } from "@/lib/types/request";
import {
  isValidStatus,
  validateCreateItemRequest,
  validateEditStatusRequest,
} from "@/lib/validation/requests";
import mongoose from "mongoose";
import Request from "@/lib/models/requestModel";
import dbConnect from "./db";

export async function createRequest(request: any) {
  try {
    await dbConnect();
    const validatedRequest = validateCreateItemRequest(request);
    if (!validatedRequest) {
      throw new InvalidInputError("Invalid input.");
    }
    const newRequest = new Request({
      requestorName: validatedRequest.requestorName,
      itemRequested: validatedRequest.itemRequested,
      status: RequestStatus.PENDING,
    });
    const savedRequest = await newRequest.save();
    return savedRequest;
  } catch (error) {
    if (error instanceof InvalidInputError) {
      throw error;
    }
    throw new Error("Error creating request");
  }
}

export async function getItemRequests(
  status: string | null,
  page: number
): Promise<{ data: any[]; totalCount: number }> {
  await dbConnect();

  try {
    const query = status && isValidStatus(status) ? { status } : {};

    const skip = (page - 1) * PAGINATION_PAGE_SIZE;
    const limit = PAGINATION_PAGE_SIZE;

    const totalCount = await Request.countDocuments(query);

    const requests = await Request.find(query)
      .sort({ requestCreatedDate: -1 })
      .skip(skip)
      .limit(limit);

    return {
      data: requests,
      totalCount: totalCount,
    };
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw new Error("Failed to fetch item requests from the database.");
  }
}

export async function editStatusRequest(request: any) {
  await dbConnect();
  const validatedRequest = validateEditStatusRequest(request);
  if (!validatedRequest) {
    throw new InvalidInputError("Invalid status");
  }
  const { id, status } = validatedRequest;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new InvalidInputError(`Invalid ID format: ${id}`);
  }
  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status, lastEditedDate: new Date() },
      { new: true }
    );

    if (!updatedRequest) {
      throw new InvalidInputError(`No request found with id: ${id}`);
    }

    return updatedRequest;
  } catch (error) {
    if (error instanceof InvalidInputError) {
      throw error;
    }
    throw new Error("Failed to update request status.");
  }
}
