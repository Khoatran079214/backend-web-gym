import { Request, Response } from "express";
import Class from "../models/Class";

class ClassController {
  // CREATE - Tạo lớp mới
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, is_active } = req.body;

      if (!name) {
        res.status(400).json({
          success: false,
          message: "name is required",
        });
        return;
      }

      const newClass = new Class({
        name,
        description: description || null,
        is_active: is_active !== undefined ? is_active : true,
      });

      await newClass.save();

      res.status(201).json({
        success: true,
        message: "Class created successfully",
        data: newClass,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create class",
      });
    }
  }

  // READ - Lấy lớp theo ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const classData = await Class.findById(id);

      if (!classData) {
        res.status(404).json({
          success: false,
          message: "Class not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Class found",
        data: classData,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }

  // READ - Lấy tất cả lớp
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const classes = await Class.find().sort({ createdAt: -1 });

      res.json({
        success: true,
        message: "Classes retrieved",
        data: classes,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve classes",
      });
    }
  }

  // UPDATE - Cập nhật lớp
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const classData = await Class.findById(id);
      if (!classData) {
        res.status(404).json({
          success: false,
          message: "Class not found",
        });
        return;
      }

      // Update fields
      if (updates.name) classData.name = updates.name;
      if (updates.description !== undefined) classData.description = updates.description;
      if (updates.is_active !== undefined) classData.is_active = updates.is_active;

      await classData.save();

      res.json({
        success: true,
        message: "Class updated successfully",
        data: classData,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update class",
      });
    }
  }

  // DELETE - Xóa lớp
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const classData = await Class.findByIdAndDelete(id);
      if (!classData) {
        res.status(404).json({
          success: false,
          message: "Class not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Class deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete class",
      });
    }
  }

  // SEARCH - Tìm lớp theo tên
  async searchByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const classes = await Class.find({ name: { $regex: name, $options: "i" } });

      res.json({
        success: true,
        message: "Classes found",
        data: classes,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }
}

export default new ClassController();
