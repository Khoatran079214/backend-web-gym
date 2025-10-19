import mongoose, { Schema, Document } from "mongoose";

export interface IClassSession extends Document {
  class_id: mongoose.Types.ObjectId;
  trainer_id?: mongoose.Types.ObjectId;
  starts_at: Date;
  ends_at: Date;
  capacity: number;
  location?: string;
  created_at: Date;
  updated_at: Date;
}

const classSessionSchema = new Schema<IClassSession>(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    trainer_id: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      default: null,
    },
    starts_at: {
      type: Date,
      required: true,
    },
    ends_at: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      default: 20,
    },
    location: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries
classSessionSchema.index({ class_id: 1 });
classSessionSchema.index({ starts_at: -1 });

export default mongoose.model<IClassSession>("ClassSession", classSessionSchema);
