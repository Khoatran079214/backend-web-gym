import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  member_id: mongoose.Types.ObjectId;
  subscription_id?: mongoose.Types.ObjectId;
  amount_cents: number;
  currency: string;
  method?: string;
  paid_at: Date;
  note?: string;
  created_at: Date;
  updated_at: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    member_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    subscription_id: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    amount_cents: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "VND",
    },
    method: {
      type: String,
      default: null,
    },
    paid_at: {
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
paymentSchema.index({ member_id: 1 });
paymentSchema.index({ subscription_id: 1 });
paymentSchema.index({ paid_at: -1 });

export default mongoose.model<IPayment>("Payment", paymentSchema);
