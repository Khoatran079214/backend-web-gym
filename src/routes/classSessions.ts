import express, { Router } from "express";
import classSessionController from "../controllers/classSessionController";

const router: Router = express.Router();

// CRUD routes
router.post("/", (req, res) => classSessionController.create(req, res));
router.get("/", (req, res) => classSessionController.getAll(req, res));
router.get("/:id", (req, res) => classSessionController.getById(req, res));
router.put("/:id", (req, res) => classSessionController.update(req, res));
router.delete("/:id", (req, res) => classSessionController.delete(req, res));

// Filter routes
router.get("/class/:class_id", (req, res) => classSessionController.getByClass(req, res));
router.get("/upcoming/list", (req, res) => classSessionController.getUpcoming(req, res));

export default router;
