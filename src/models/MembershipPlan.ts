import mongoose, { Schema, Document } from "mongoose";

export interface IMembershipPlan extends Document {
  name: string;
  description?: string;
  duration_days?: number;
  session_count?: number;
  price_cents: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const membershipPlanSchema = new Schema<IMembershipPlan>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    duration_days: {
      type: Number,
      default: null,
    },
    session_count: {
      type: Number,
      default: null,
    },
    price_cents: {
      type: Number,
      required: true,
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

export default mongoose.model<IMembershipPlan>("MembershipPlan", membershipPlanSchema);
