import { Request, Response } from "express";
import Subscription from "../models/Subscription";

class SubscriptionController {
  // CREATE - Tạo đăng ký gói mới
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { member_id, plan_id, start_date, end_date, remaining_sessions, status } = req.body;

      if (!member_id || !plan_id || !start_date) {
        res.status(400).json({
          success: false,
          message: "member_id, plan_id, and start_date are required",
        });
        return;
      }

      const newSubscription = new Subscription({
        member_id,
        plan_id,
        start_date: new Date(start_date),
        end_date: end_date ? new Date(end_date) : null,
        remaining_sessions: remaining_sessions || null,
        status: status || "active",
      });

      await newSubscription.save();

      res.status(201).json({
        success: true,
        message: "Subscription created successfully",
        data: newSubscription,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create subscription",
      });
    }
  }

  // READ - Lấy đăng ký gói theo ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const subscription = await Subscription.findById(id)
        .populate("member_id")
        .populate("plan_id");

      if (!subscription) {
        res.status(404).json({
          success: false,
          message: "Subscription not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Subscription found",
        data: subscription,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }

  // READ - Lấy tất cả đăng ký gói
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const subscriptions = await Subscription.find()
        .populate("member_id")
        .populate("plan_id")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        message: "Subscriptions retrieved",
        data: subscriptions,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve subscriptions",
      });
    }
  }

  // UPDATE - Cập nhật đăng ký gói
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const subscription = await Subscription.findById(id);
      if (!subscription) {
        res.status(404).json({
          success: false,
          message: "Subscription not found",
        });
        return;
      }

      // Update fields
      if (updates.end_date !== undefined) subscription.end_date = updates.end_date ? new Date(updates.end_date) : null;
      if (updates.remaining_sessions !== undefined) subscription.remaining_sessions = updates.remaining_sessions;
      if (updates.status) subscription.status = updates.status;

      await subscription.save();

      res.json({
        success: true,
        message: "Subscription updated successfully",
        data: subscription,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update subscription",
      });
    }
  }

  // DELETE - Xóa đăng ký gói
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const subscription = await Subscription.findByIdAndDelete(id);
      if (!subscription) {
        res.status(404).json({
          success: false,
          message: "Subscription not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Subscription deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete subscription",
      });
    }
  }

  // SEARCH - Lấy đăng ký gói của hội viên
  async getByMember(req: Request, res: Response): Promise<void> {
    try {
      const { member_id } = req.params;
      const subscriptions = await Subscription.find({ member_id })
        .populate("plan_id")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        message: "Subscriptions found",
        data: subscriptions,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }
}

export default new SubscriptionController();
