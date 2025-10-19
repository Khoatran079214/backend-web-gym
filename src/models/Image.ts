import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const imageSchema = new Schema<IImage>(
  {
    filename: {
      type: String,
      required: true,
    },
    file_path: {
      type: String,
      required: true,
    },
    file_size: {
      type: Number,
      default: null,
    },
    mime_type: {
      type: String,
      default: null,
    },
    uploaded_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IImage>("Image", imageSchema);
