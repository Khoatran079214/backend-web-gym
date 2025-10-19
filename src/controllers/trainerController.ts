import { Request, Response } from "express";
import Trainer from "../models/Trainer";

class TrainerController {
  // CREATE - Tạo huấn luyện viên mới
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { full_name, phone, email, specialty, image_id, is_active } = req.body;

      if (!full_name) {
        res.status(400).json({
          success: false,
          message: "full_name is required",
        });
        return;
      }

      const newTrainer = new Trainer({
        full_name,
        phone: phone || null,
        email: email || null,
        specialty: specialty || null,
        image_id: image_id || null,
        is_active: is_active !== undefined ? is_active : true,
      });

      await newTrainer.save();

      res.status(201).json({
        success: true,
        message: "Trainer created successfully",
        data: newTrainer,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create trainer",
      });
    }
  }

  // READ - Lấy huấn luyện viên theo ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const trainer = await Trainer.findById(id).populate("image_id");

      if (!trainer) {
        res.status(404).json({
          success: false,
          message: "Trainer not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Trainer found",
        data: trainer,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }

  // READ - Lấy tất cả huấn luyện viên
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const trainers = await Trainer.find().populate("image_id").sort({ createdAt: -1 });

      res.json({
        success: true,
        message: "Trainers retrieved",
        data: trainers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve trainers",
      });
    }
  }

  // UPDATE - Cập nhật huấn luyện viên
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const trainer = await Trainer.findById(id);
      if (!trainer) {
        res.status(404).json({
          success: false,
          message: "Trainer not found",
        });
        return;
      }

      // Update fields
      if (updates.full_name) trainer.full_name = updates.full_name;
      if (updates.phone !== undefined) trainer.phone = updates.phone;
      if (updates.email !== undefined) trainer.email = updates.email;
      if (updates.specialty !== undefined) trainer.specialty = updates.specialty;
      if (updates.image_id !== undefined) trainer.image_id = updates.image_id;
      if (updates.is_active !== undefined) trainer.is_active = updates.is_active;

      await trainer.save();

      res.json({
        success: true,
        message: "Trainer updated successfully",
        data: trainer,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update trainer",
      });
    }
  }

  // DELETE - Xóa huấn luyện viên
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const trainer = await Trainer.findByIdAndDelete(id);
      if (!trainer) {
        res.status(404).json({
          success: false,
          message: "Trainer not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Trainer deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete trainer",
      });
    }
  }

  // SEARCH - Tìm huấn luyện viên theo specialty
  async searchBySpecialty(req: Request, res: Response): Promise<void> {
    try {
      const { specialty } = req.params;
      const trainers = await Trainer.find({ specialty }).populate("image_id");

      res.json({
        success: true,
        message: "Trainers found",
        data: trainers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }
}

export default new TrainerController();
