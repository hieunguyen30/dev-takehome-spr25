import { ResponseType } from "@/lib/types/apiResponse";
import {
  createRequest,
  editStatusRequest,
  getItemRequests,
} from "@/server/requests";
import { ServerResponseBuilder } from "@/lib/builders/serverResponseBuilder";
import { InvalidInputError } from "@/lib/errors/inputExceptions";
import dbConnect from "@/server/db";

export async function GET(request: Request) {
  await dbConnect();
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const page = parseInt(url.searchParams.get("page") || "1");
  try {
    const paginatedRequests = await getItemRequests(status, page);
    return new Response(JSON.stringify(paginatedRequests), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PUT(request: Request) {
  try {
    const req = await request.json();
    const newRequest = await createRequest(req);
    return new Response(JSON.stringify(newRequest), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e instanceof InvalidInputError) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PATCH(request: Request) {
  try {
    const req = await request.json();
    const editedRequest = editStatusRequest(req);
    return new Response(JSON.stringify(editedRequest), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e instanceof InvalidInputError) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}
