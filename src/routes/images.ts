import express, { Router } from "express";
import imageController from "../controllers/imageController";

const router: Router = express.Router();

// CRUD routes
router.post("/", (req, res) => imageController.create(req, res));
router.get("/", (req, res) => imageController.getAll(req, res));
router.get("/:id", (req, res) => imageController.getById(req, res));
router.put("/:id", (req, res) => imageController.update(req, res));
router.delete("/:id", (req, res) => imageController.delete(req, res));

// Filter routes
router.get("/uploaded-by/:user_id", (req, res) => imageController.getByUploadedBy(req, res));

export default router;
