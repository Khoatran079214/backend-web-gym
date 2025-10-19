import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  member_id: mongoose.Types.ObjectId;
  plan_id: mongoose.Types.ObjectId;
  start_date: Date;
  end_date?: Date;
  remaining_sessions?: number;
  status: "active" | "expired" | "paused" | "cancelled";
  created_at: Date;
  updated_at: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    member_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    plan_id: {
      type: Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      default: null,
    },
    remaining_sessions: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "expired", "paused", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries
subscriptionSchema.index({ member_id: 1 });
subscriptionSchema.index({ status: 1 });

export default mongoose.model<ISubscription>("Subscription", subscriptionSchema);
