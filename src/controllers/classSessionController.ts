import { Request, Response } from "express";
import ClassSession from "../models/ClassSession";

class ClassSessionController {
  // CREATE - Tạo ca lớp mới
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { class_id, trainer_id, starts_at, ends_at, capacity, location } = req.body;

      if (!class_id || !starts_at || !ends_at) {
        res.status(400).json({
          success: false,
          message: "class_id, starts_at, and ends_at are required",
        });
        return;
      }

      const newSession = new ClassSession({
        class_id,
        trainer_id: trainer_id || null,
        starts_at: new Date(starts_at),
        ends_at: new Date(ends_at),
        capacity: capacity || 20,
        location: location || null,
      });

      await newSession.save();

      res.status(201).json({
        success: true,
        message: "Class session created successfully",
        data: newSession,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create class session",
      });
    }
  }

  // READ - Lấy ca lớp theo ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const session = await ClassSession.findById(id)
        .populate("class_id")
        .populate("trainer_id");

      if (!session) {
        res.status(404).json({
          success: false,
          message: "Class session not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Class session found",
        data: session,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }

  // READ - Lấy tất cả ca lớp
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const sessions = await ClassSession.find()
        .populate("class_id")
        .populate("trainer_id")
        .sort({ starts_at: -1 });

      res.json({
        success: true,
        message: "Class sessions retrieved",
        data: sessions,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve class sessions",
      });
    }
  }

  // UPDATE - Cập nhật ca lớp
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const session = await ClassSession.findById(id);
      if (!session) {
        res.status(404).json({
          success: false,
          message: "Class session not found",
        });
        return;
      }

      // Update fields
      if (updates.trainer_id !== undefined) session.trainer_id = updates.trainer_id;
      if (updates.starts_at) session.starts_at = new Date(updates.starts_at);
      if (updates.ends_at) session.ends_at = new Date(updates.ends_at);
      if (updates.capacity) session.capacity = updates.capacity;
      if (updates.location !== undefined) session.location = updates.location;

      await session.save();

      res.json({
        success: true,
        message: "Class session updated successfully",
        data: session,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update class session",
      });
    }
  }

  // DELETE - Xóa ca lớp
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const session = await ClassSession.findByIdAndDelete(id);
      if (!session) {
        res.status(404).json({
          success: false,
          message: "Class session not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Class session deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete class session",
      });
    }
  }

  // GET BY CLASS - Lấy ca lớp của một lớp
  async getByClass(req: Request, res: Response): Promise<void> {
    try {
      const { class_id } = req.params;
      const sessions = await ClassSession.find({ class_id })
        .populate("trainer_id")
        .sort({ starts_at: -1 });

      res.json({
        success: true,
        message: "Class sessions found",
        data: sessions,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }

  // GET UPCOMING - Lấy ca lớp sắp tới
  async getUpcoming(req: Request, res: Response): Promise<void> {
    try {
      const now = new Date();
      const sessions = await ClassSession.find({ starts_at: { $gte: now } })
        .populate("class_id")
        .populate("trainer_id")
        .sort({ starts_at: 1 });

      res.json({
        success: true,
        message: "Upcoming class sessions retrieved",
        data: sessions,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }
}

export default new ClassSessionController();
