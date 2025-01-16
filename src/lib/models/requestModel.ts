import mongoose, { Schema, Document } from "mongoose";
import { RequestStatus } from "@/lib/types/request";

interface IRequest extends Document {
  requestorName: string;
  itemRequested: string;
  requestCreatedDate: Date;
  lastEditedDate: Date;
  status: RequestStatus;
}
const RequestSchema: Schema = new mongoose.Schema(
    {
      requestorName: { type: String, required: true },
      itemRequested: { type: String, required: true },
      requestCreatedDate: { type: Date, default: Date.now },
      lastEditedDate: { type: Date, default: Date.now },
      status: { type: String, enum: Object.values(RequestStatus), required: true },
    },
    { versionKey: false }
  );

const Request =
  mongoose.models.Request || mongoose.model<IRequest>("Request", RequestSchema);

export default Request;

