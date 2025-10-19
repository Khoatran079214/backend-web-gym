import mongoose, { Schema, Document } from "mongoose";

export interface ICheckin extends Document {
  member_id: mongoose.Types.ObjectId;
  checked_in_at: Date;
  note?: string;
  created_at: Date;
  updated_at: Date;
}

const checkinSchema = new Schema<ICheckin>(
  {
    member_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    checked_in_at: {
      type: Date,
      default: () => new Date(),
    },
    note: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries
checkinSchema.index({ member_id: 1 });
checkinSchema.index({ checked_in_at: -1 });

export default mongoose.model<ICheckin>("Checkin", checkinSchema);
