import express, { Router, Request, Response } from "express";
import User from "../models/User";
import { CreateUserRequest, UpdateUserRequest, ApiResponse } from "../types";

const router = Router();

// CREATE - Tạo user mới
router.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password_hash, role = "staff", linked_trainer, linked_member } = req.body as CreateUserRequest;

    if (!username || !password_hash) {
      return res.status(400).json({
        success: false,
        message: "Username and password_hash are required",
      });
    }

    const newUser = new User({
      username,
      password_hash,
      role,
      linked_trainer: linked_trainer || null,
      linked_member: linked_member || null,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create user",
    });
  }
});

// READ - Lấy user theo ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Database error",
    });
  }
});

// READ - Lấy tất cả users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Users retrieved",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve users",
    });
  }
});

// UPDATE - Cập nhật user
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body as UpdateUserRequest;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    if (updates.username) user.username = updates.username;
    if (updates.password_hash) user.password_hash = updates.password_hash;
    if (updates.role) user.role = updates.role as "admin" | "staff" | "trainer";
    if (updates.linked_trainer !== undefined) user.linked_trainer = updates.linked_trainer;
    if (updates.linked_member !== undefined) user.linked_member = updates.linked_member;
    if (updates.last_login_at) user.last_login_at = new Date(updates.last_login_at);

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update user",
    });
  }
});

// DELETE - Xóa user
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
});

// SEARCH - Tìm user theo username
router.get("/search/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Database error",
    });
  }
});

export default router;
