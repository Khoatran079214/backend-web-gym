import { Request, Response } from "express";
import Member from "../models/Member";

// CREATE - Tạo hội viên mới
export const createMember = async (req: Request, res: Response) => {
  try {
    const { full_name, phone, email, date_of_birth, gender, address, status } = req.body;

    if (!full_name) {
      return res.status(400).json({
        success: false,
        message: "full_name is required",
      });
    }

    const newMember = new Member({
      full_name,
      phone: phone || null,
      email: email || null,
      date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
      gender: gender || null,
      address: address || null,
      status: status || "active",
    });

    await newMember.save();

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: newMember,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create member",
    });
  }
};

// READ - Lấy hội viên theo ID
export const getMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      message: "Member found",
      data: member,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Database error",
    });
  }
};

// READ - Lấy tất cả hội viên
export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Members retrieved",
      data: members,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve members",
    });
  }
};

// UPDATE - Cập nhật hội viên
export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Update fields
    if (updates.full_name) member.full_name = updates.full_name;
    if (updates.phone !== undefined) member.phone = updates.phone;
    if (updates.email !== undefined) member.email = updates.email;
    if (updates.date_of_birth) member.date_of_birth = new Date(updates.date_of_birth);
    if (updates.gender !== undefined) member.gender = updates.gender;
    if (updates.address !== undefined) member.address = updates.address;
    if (updates.status) member.status = updates.status;

    await member.save();

    res.json({
      success: true,
      message: "Member updated successfully",
      data: member,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update member",
    });
  }
};

// DELETE - Xóa hội viên
export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete member",
    });
  }
};

// SEARCH - Tìm hội viên theo email
export const searchMemberByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const member = await Member.findOne({ email });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      message: "Member found",
      data: member,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Database error",
    });
  }
};
