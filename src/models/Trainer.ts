import mongoose, { Schema, Document } from "mongoose";

export interface ITrainer extends Document {
  full_name: string;
  phone?: string;
  email?: string;
  specialty?: string;
  image_id?: mongoose.Types.ObjectId;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const trainerSchema = new Schema<ITrainer>(
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
    specialty: {
      type: String,
      default: null,
    },
    image_id: {
      type: Schema.Types.ObjectId,
      ref: "Image",
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITrainer>("Trainer", trainerSchema);
