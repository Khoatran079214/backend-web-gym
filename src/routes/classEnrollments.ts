import express, { Router } from "express";
import classEnrollmentController from "../controllers/classEnrollmentController";

const router: Router = express.Router();

// CRUD routes
router.post("/", (req, res) => classEnrollmentController.create(req, res));
router.get("/", (req, res) => classEnrollmentController.getAll(req, res));
router.get("/:id", (req, res) => classEnrollmentController.getById(req, res));
router.put("/:id", (req, res) => classEnrollmentController.update(req, res));
router.delete("/:id", (req, res) => classEnrollmentController.delete(req, res));

// Filter routes
router.get("/session/:session_id", (req, res) => classEnrollmentController.getBySession(req, res));
router.get("/member/:member_id", (req, res) => classEnrollmentController.getByMember(req, res));

export default router;
