import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { initializeDatabase } from "./db/database";

// Import all routes
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import membersRouter from "./routes/members";
import trainersRouter from "./routes/trainers";
import classesRouter from "./routes/classes";
import subscriptionsRouter from "./routes/subscriptions";
import checkinsRouter from "./routes/checkins";
import membershipPlansRouter from "./routes/membershipPlans";
import imagesRouter from "./routes/images";
import classSessionsRouter from "./routes/classSessions";
import classEnrollmentsRouter from "./routes/classEnrollments";
import paymentsRouter from "./routes/payments";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { swaggerOptions: { persistAuthorization: true } }));

// Routes
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/members", membersRouter);
app.use("/trainers", trainersRouter);
app.use("/classes", classesRouter);
app.use("/subscriptions", subscriptionsRouter);
app.use("/checkins", checkinsRouter);
app.use("/membership-plans", membershipPlansRouter);
app.use("/images", imagesRouter);
app.use("/class-sessions", classSessionsRouter);
app.use("/class-enrollments", classEnrollmentsRouter);
app.use("/payments", paymentsRouter);

// Health check
app.get("/test", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Initialize Database and Start Server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
