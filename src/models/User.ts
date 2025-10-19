import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  username: string;
  password_hash: string;
  role: "admin" | "staff" | "trainer";
  linked_trainer?: mongoose.Types.ObjectId;
  linked_member?: mongoose.Types.ObjectId;
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "staff", "trainer"],
      default: "staff",
    },
    linked_trainer: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      default: null,
    },
    linked_member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },
    last_login_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash")) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password_hash = await bcryptjs.hash(this.password_hash, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcryptjs.compare(password, this.password_hash);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password_hash;
  return obj;
};

export default mongoose.model<IUser>("User", userSchema);
