import { Request, Response } from "express";
import Checkin from "../models/Checkin";

// CREATE - Tạo điểm danh mới
export const createCheckin = async (req: Request, res: Response) => {
  try {
    const { member_id, checked_in_at, note } = req.body;

    if (!member_id) {
      return res.status(400).json({
        success: false,
        message: "member_id is required",
      });
    }

    const newCheckin = new Checkin({
      member_id,
      checked_in_at: checked_in_at ? new Date(checked_in_at) : new Date(),
      note: note || null,
    });

    await newCheckin.save();

    res.status(201).json({
      success: true,
      message: "Checkin created successfully",
      data: newCheckin,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create checkin",
    });
  }
};

// READ - Lấy điểm danh theo ID
export const getCheckin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const checkin = await Checkin.findById(id).populate("member_id");

    if (!checkin) {
      return res.status(404).json({
        success: false,
        message: "Checkin not found",
      });
    }

    res.json({
      success: true,
      message: "Checkin found",
      data: checkin,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Database error",
    });
  }
};

// READ - Lấy tất cả điểm danh
export const getAllCheckins = async (req: Request, res: Response) => {
  try {
    const checkins = await Checkin.find()
      .populate("member_id")
      .sort({ checked_in_at: -1 });

    res.json({
      success: true,
      message: "Checkins retrieved",
      data: checkins,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve checkins",
    });
  }
};

// UPDATE - Cập nhật điểm danh
export const updateCheckin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const checkin = await Checkin.findById(id);
    if (!checkin) {
      return res.status(404).json({
        success: false,
        message: "Checkin not found",
      });
    }

    // Update fields
    if (updates.note !== undefined) checkin.note = updates.note;

    await checkin.save();

    res.json({
      success: true,
      message: "Checkin updated successfully",
      data: checkin,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update checkin",
    });
  }
};

// DELETE - Xóa điểm danh
export const deleteCheckin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const checkin = await Checkin.findByIdAndDelete(id);
    if (!checkin) {
      return res.status(404).json({
        success: false,
        message: "Checkin not found",
      });
    }

    res.json({
      success: true,
      message: "Checkin deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete checkin",
    });
  }
};

// SEARCH - Lấy điểm danh của hội viên
export const getCheckinsByMember = async (req: Request, res: Response) => {
  try {
    const { member_id } = req.params;
    const checkins = await Checkin.find({ member_id }).sort({ checked_in_at: -1 });

    res.json({
      success: true,
      message: "Checkins found",
      data: checkins,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Database error",
    });
  }
};

// STATS - Lấy thống kê điểm danh hôm nay
export const getTodayCheckins = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkins = await Checkin.find({
      checked_in_at: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .populate("member_id")
      .sort({ checked_in_at: -1 });

    res.json({
      success: true,
      message: "Today checkins retrieved",
      data: checkins,
      count: checkins.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Database error",
    });
  }
};
