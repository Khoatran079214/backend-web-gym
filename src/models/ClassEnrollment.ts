import mongoose, { Schema, Document } from "mongoose";

export interface IClassEnrollment extends Document {
  session_id: mongoose.Types.ObjectId;
  member_id: mongoose.Types.ObjectId;
  enrolled_at: Date;
  status: "enrolled" | "cancelled" | "attended" | "missed";
  created_at: Date;
  updated_at: Date;
}

const classEnrollmentSchema = new Schema<IClassEnrollment>(
  {
    session_id: {
      type: Schema.Types.ObjectId,
      ref: "ClassSession",
      required: true,
    },
    member_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    enrolled_at: {
      type: Date,
      default: () => new Date(),
    },
    status: {
      type: String,
      enum: ["enrolled", "cancelled", "attended", "missed"],
      default: "enrolled",
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one member per session
classEnrollmentSchema.index({ session_id: 1, member_id: 1 }, { unique: true });
classEnrollmentSchema.index({ member_id: 1 });

export default mongoose.model<IClassEnrollment>("ClassEnrollment", classEnrollmentSchema);
