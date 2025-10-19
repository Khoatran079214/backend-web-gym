import mongoose, { Schema, Document } from "mongoose";

export interface IMember extends Document {
  full_name: string;
  phone?: string;
  email?: string;
  date_of_birth?: Date;
  gender?: "male" | "female" | "other";
  address?: string;
  status: "active" | "inactive";
  created_at: Date;
  updated_at: Date;
}

const memberSchema = new Schema<IMember>(
  {
    full_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    date_of_birth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMember>("Member", memberSchema);
