import { Request, Response } from "express";
import ClassEnrollment from "../models/ClassEnrollment";

class ClassEnrollmentController {
  // CREATE - Đăng ký ca lớp
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { session_id, member_id, status } = req.body;

      if (!session_id || !member_id) {
        res.status(400).json({
          success: false,
          message: "session_id and member_id are required",
        });
        return;
      }

      // Check if already enrolled
      const existing = await ClassEnrollment.findOne({ session_id, member_id });
      if (existing) {
        res.status(400).json({
          success: false,
          message: "Member already enrolled in this session",
        });
        return;
      }

      const newEnrollment = new ClassEnrollment({
        session_id,
        member_id,
        status: status || "enrolled",
      });

      await newEnrollment.save();

      res.status(201).json({
        success: true,
        message: "Enrollment created successfully",
        data: newEnrollment,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create enrollment",
      });
    }
  }

  // READ - Lấy đăng ký theo ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const enrollment = await ClassEnrollment.findById(id)
        .populate("session_id")
        .populate("member_id");

      if (!enrollment) {
        res.status(404).json({
          success: false,
          message: "Enrollment not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Enrollment found",
        data: enrollment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }

  // READ - Lấy tất cả đăng ký
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const enrollments = await ClassEnrollment.find()
        .populate("session_id")
        .populate("member_id")
        .sort({ enrolled_at: -1 });

      res.json({
        success: true,
        message: "Enrollments retrieved",
        data: enrollments,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve enrollments",
      });
    }
  }

  // UPDATE - Cập nhật trạng thái đăng ký
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const enrollment = await ClassEnrollment.findById(id);
      if (!enrollment) {
        res.status(404).json({
          success: false,
          message: "Enrollment not found",
        });
        return;
      }

      if (status) enrollment.status = status;

      await enrollment.save();

      res.json({
        success: true,
        message: "Enrollment updated successfully",
        data: enrollment,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update enrollment",
      });
    }
  }

  // DELETE - Hủy đăng ký
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const enrollment = await ClassEnrollment.findByIdAndDelete(id);
      if (!enrollment) {
        res.status(404).json({
          success: false,
          message: "Enrollment not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Enrollment deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete enrollment",
      });
    }
  }

  // GET BY SESSION - Lấy đăng ký của ca lớp
  async getBySession(req: Request, res: Response): Promise<void> {
    try {
      const { session_id } = req.params;
      const enrollments = await ClassEnrollment.find({ session_id })
        .populate("member_id")
        .sort({ enrolled_at: -1 });

      res.json({
        success: true,
        message: "Enrollments found",
        data: enrollments,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }

  // GET BY MEMBER - Lấy đăng ký của hội viên
  async getByMember(req: Request, res: Response): Promise<void> {
    try {
      const { member_id } = req.params;
      const enrollments = await ClassEnrollment.find({ member_id })
        .populate("session_id")
        .sort({ enrolled_at: -1 });

      res.json({
        success: true,
        message: "Enrollments found",
        data: enrollments,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }
}

export default new ClassEnrollmentController();
