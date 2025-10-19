import { Request, Response } from "express";
import Trainer from "../models/Trainer";

// CREATE - Tạo huấn luyện viên mới
export const createTrainer = async (req: Request, res: Response) => {
  try {
    const { full_name, phone, email, specialty, image_id, is_active } = req.body;

    if (!full_name) {
      return res.status(400).json({
        success: false,
        message: "full_name is required",
      });
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
};

// READ - Lấy huấn luyện viên theo ID
export const getTrainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trainer = await Trainer.findById(id).populate("image_id");

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
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
};

// READ - Lấy tất cả huấn luyện viên
export const getAllTrainers = async (req: Request, res: Response) => {
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
};

// UPDATE - Cập nhật huấn luyện viên
export const updateTrainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const trainer = await Trainer.findById(id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
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
};

// DELETE - Xóa huấn luyện viên
export const deleteTrainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findByIdAndDelete(id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
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
};

// SEARCH - Tìm huấn luyện viên theo specialty
export const searchTrainerBySpecialty = async (req: Request, res: Response) => {
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
};
