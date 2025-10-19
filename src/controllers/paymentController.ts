import { Request, Response } from "express";
import Payment from "../models/Payment";

class PaymentController {
  // CREATE - Tạo thanh toán mới
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { member_id, subscription_id, amount_cents, currency, method, note } = req.body;

      if (!member_id || !amount_cents) {
        res.status(400).json({
          success: false,
          message: "member_id and amount_cents are required",
        });
        return;
      }

      const newPayment = new Payment({
        member_id,
        subscription_id: subscription_id || null,
        amount_cents,
        currency: currency || "VND",
        method: method || null,
        note: note || null,
      });

      await newPayment.save();

      res.status(201).json({
        success: true,
        message: "Payment created successfully",
        data: newPayment,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create payment",
      });
    }
  }

  // READ - Lấy thanh toán theo ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id)
        .populate("member_id")
        .populate("subscription_id");

      if (!payment) {
        res.status(404).json({
          success: false,
          message: "Payment not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Payment found",
        data: payment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }

  // READ - Lấy tất cả thanh toán
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const payments = await Payment.find()
        .populate("member_id")
        .populate("subscription_id")
        .sort({ paid_at: -1 });

      res.json({
        success: true,
        message: "Payments retrieved",
        data: payments,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve payments",
      });
    }
  }

  // UPDATE - Cập nhật thanh toán
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const payment = await Payment.findById(id);
      if (!payment) {
        res.status(404).json({
          success: false,
          message: "Payment not found",
        });
        return;
      }

      // Update fields
      if (updates.method !== undefined) payment.method = updates.method;
      if (updates.note !== undefined) payment.note = updates.note;

      await payment.save();

      res.json({
        success: true,
        message: "Payment updated successfully",
        data: payment,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update payment",
      });
    }
  }

  // DELETE - Xóa thanh toán
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const payment = await Payment.findByIdAndDelete(id);
      if (!payment) {
        res.status(404).json({
          success: false,
          message: "Payment not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Payment deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete payment",
      });
    }
  }

  // GET BY MEMBER - Lấy thanh toán của hội viên
  async getByMember(req: Request, res: Response): Promise<void> {
    try {
      const { member_id } = req.params;
      const payments = await Payment.find({ member_id })
        .populate("subscription_id")
        .sort({ paid_at: -1 });

      res.json({
        success: true,
        message: "Payments found",
        data: payments,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }

  // GET STATS - Thống kê doanh thu
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { from_date, to_date } = req.query;

      const query: any = {};
      if (from_date || to_date) {
        query.paid_at = {};
        if (from_date) query.paid_at.$gte = new Date(from_date as string);
        if (to_date) query.paid_at.$lte = new Date(to_date as string);
      }

      const payments = await Payment.find(query);
      const totalAmount = payments.reduce((sum, p) => sum + p.amount_cents, 0);
      const count = payments.length;

      res.json({
        success: true,
        message: "Payment stats retrieved",
        data: {
          total_amount_cents: totalAmount,
          total_amount_vnd: totalAmount / 100,
          payment_count: count,
          average_amount_cents: count > 0 ? totalAmount / count : 0,
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

export default new PaymentController();
