import { Request, Response } from "express";
import User from "../models/User";
import bcryptjs from "bcryptjs";

class AuthController {
  // REGISTER - Đăng ký user mới
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: "username and password are required",
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "Username already exists",
        });
        return;
      }

      // Hash password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      // Always set role to "staff" for new registrations
      // Only admin can change role to "trainer" or "admin"
      const newUser = new User({
        username,
        password_hash: hashedPassword,
        role: "staff",
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: newUser._id,
          username: newUser.username,
          role: newUser.role,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to register user",
      });
    }
  }

  // LOGIN - Đăng nhập
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: "username and password are required",
        });
        return;
      }

      // Find user
      const user = await User.findOne({ username });
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
        return;
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
        return;
      }

      // Update last login
      user.last_login_at = new Date();
      await user.save();

      res.json({
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          username: user.username,
          role: user.role,
          last_login_at: user.last_login_at,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  }

  // CHANGE PASSWORD - Đổi mật khẩu
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, old_password, new_password } = req.body;

      if (!user_id || !old_password || !new_password) {
        res.status(400).json({
          success: false,
          message: "user_id, old_password, and new_password are required",
        });
        return;
      }

      // Find user
      const user = await User.findById(user_id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      // Verify old password
      const isPasswordValid = await user.comparePassword(old_password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Old password is incorrect",
        });
        return;
      }

      // Hash new password
      const salt = await bcryptjs.genSalt(10);
      user.password_hash = await bcryptjs.hash(new_password, salt);
      await user.save();

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to change password",
      });
    }
  }

  // FORGOT PASSWORD - Quên mật khẩu (reset)
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { username, new_password } = req.body;

      if (!username || !new_password) {
        res.status(400).json({
          success: false,
          message: "username and new_password are required",
        });
        return;
      }

      // Find user
      const user = await User.findOne({ username });
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      // Hash new password
      const salt = await bcryptjs.genSalt(10);
      user.password_hash = await bcryptjs.hash(new_password, salt);
      await user.save();

      res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to reset password",
      });
    }
  }

  // GET PROFILE - Lấy thông tin user
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;

      const user = await User.findById(user_id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Profile retrieved",
        data: {
          id: user._id,
          username: user.username,
          role: user.role,
          linked_trainer: user.linked_trainer,
          linked_member: user.linked_member,
          last_login_at: user.last_login_at,
          created_at: user.createdAt,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }
}

export default new AuthController();
