import { Request, Response } from "express";
import MembershipPlan from "../models/MembershipPlan";

class MembershipPlanController {
  // CREATE - Tạo gói tập mới
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, duration_days, session_count, price_cents, is_active } = req.body;

      if (!name || !price_cents) {
        res.status(400).json({
          success: false,
          message: "name and price_cents are required",
        });
        return;
      }

      const newPlan = new MembershipPlan({
        name,
        description: description || null,
        duration_days: duration_days || null,
        session_count: session_count || null,
        price_cents,
        is_active: is_active !== undefined ? is_active : true,
      });

      await newPlan.save();

      res.status(201).json({
        success: true,
        message: "Membership plan created successfully",
        data: newPlan,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create membership plan",
      });
    }
  }

  // READ - Lấy gói tập theo ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const plan = await MembershipPlan.findById(id);

      if (!plan) {
        res.status(404).json({
          success: false,
          message: "Membership plan not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Membership plan found",
        data: plan,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }

  // READ - Lấy tất cả gói tập
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const plans = await MembershipPlan.find().sort({ createdAt: -1 });

      res.json({
        success: true,
        message: "Membership plans retrieved",
        data: plans,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve membership plans",
      });
    }
  }

  // UPDATE - Cập nhật gói tập
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const plan = await MembershipPlan.findById(id);
      if (!plan) {
        res.status(404).json({
          success: false,
          message: "Membership plan not found",
        });
        return;
      }

      // Update fields
      if (updates.name) plan.name = updates.name;
      if (updates.description !== undefined) plan.description = updates.description;
      if (updates.duration_days !== undefined) plan.duration_days = updates.duration_days;
      if (updates.session_count !== undefined) plan.session_count = updates.session_count;
      if (updates.price_cents) plan.price_cents = updates.price_cents;
      if (updates.is_active !== undefined) plan.is_active = updates.is_active;

      await plan.save();

      res.json({
        success: true,
        message: "Membership plan updated successfully",
        data: plan,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update membership plan",
      });
    }
  }

  // DELETE - Xóa gói tập
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const plan = await MembershipPlan.findByIdAndDelete(id);
      if (!plan) {
        res.status(404).json({
          success: false,
          message: "Membership plan not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Membership plan deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete membership plan",
      });
    }
  }

  // GET ACTIVE - Lấy gói tập đang hoạt động
  async getActive(req: Request, res: Response): Promise<void> {
    try {
      const plans = await MembershipPlan.find({ is_active: true }).sort({ price_cents: 1 });

      res.json({
        success: true,
        message: "Active membership plans retrieved",
        data: plans,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }
}

export default new MembershipPlanController();
