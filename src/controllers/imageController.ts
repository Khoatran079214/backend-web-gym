import { Request, Response } from "express";
import Image from "../models/Image";

class ImageController {
  // CREATE - Upload hình ảnh mới
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { filename, file_path, file_size, mime_type, uploaded_by } = req.body;

      if (!filename || !file_path) {
        res.status(400).json({
          success: false,
          message: "filename and file_path are required",
        });
        return;
      }

      const newImage = new Image({
        filename,
        file_path,
        file_size: file_size || null,
        mime_type: mime_type || null,
        uploaded_by: uploaded_by || null,
      });

      await newImage.save();

      res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        data: newImage,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to upload image",
      });
    }
  }

  // READ - Lấy hình ảnh theo ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const image = await Image.findById(id).populate("uploaded_by");

      if (!image) {
        res.status(404).json({
          success: false,
          message: "Image not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Image found",
        data: image,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }

  // READ - Lấy tất cả hình ảnh
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const images = await Image.find().populate("uploaded_by").sort({ createdAt: -1 });

      res.json({
        success: true,
        message: "Images retrieved",
        data: images,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve images",
      });
    }
  }

  // UPDATE - Cập nhật thông tin hình ảnh
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const image = await Image.findById(id);
      if (!image) {
        res.status(404).json({
          success: false,
          message: "Image not found",
        });
        return;
      }

      // Update fields
      if (updates.filename) image.filename = updates.filename;
      if (updates.file_path) image.file_path = updates.file_path;
      if (updates.file_size !== undefined) image.file_size = updates.file_size;
      if (updates.mime_type !== undefined) image.mime_type = updates.mime_type;

      await image.save();

      res.json({
        success: true,
        message: "Image updated successfully",
        data: image,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update image",
      });
    }
  }

  // DELETE - Xóa hình ảnh
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const image = await Image.findByIdAndDelete(id);
      if (!image) {
        res.status(404).json({
          success: false,
          message: "Image not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete image",
      });
    }
  }

  // GET BY USER - Lấy hình ảnh của user
  async getByUploadedBy(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const images = await Image.find({ uploaded_by: user_id }).sort({ createdAt: -1 });

      res.json({
        success: true,
        message: "Images found",
        data: images,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Database error",
      });
    }
  }
}

export default new ImageController();
