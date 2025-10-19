import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gym Manager API",
      version: "1.0.0",
      description: "API documentation for Gym Manager application",
      contact: {
        name: "Gym Manager Team",
        email: "support@gymmanager.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.gymmanager.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            role: { type: "string", enum: ["admin", "staff", "trainer"] },
            last_login_at: { type: "string", format: "date-time" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Member: {
          type: "object",
          properties: {
            id: { type: "string" },
            full_name: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            date_of_birth: { type: "string", format: "date" },
            gender: { type: "string", enum: ["male", "female", "other"] },
            address: { type: "string" },
            status: { type: "string", enum: ["active", "inactive"] },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Trainer: {
          type: "object",
          properties: {
            id: { type: "string" },
            full_name: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            specialty: { type: "string" },
            is_active: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Class: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            is_active: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        MembershipPlan: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            duration_days: { type: "integer" },
            session_count: { type: "integer" },
            price_cents: { type: "integer" },
            is_active: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Subscription: {
          type: "object",
          properties: {
            id: { type: "string" },
            member_id: { type: "string" },
            plan_id: { type: "string" },
            start_date: { type: "string", format: "date-time" },
            end_date: { type: "string", format: "date-time" },
            remaining_sessions: { type: "integer" },
            status: { type: "string", enum: ["active", "expired", "paused", "cancelled"] },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Checkin: {
          type: "object",
          properties: {
            id: { type: "string" },
            member_id: { type: "string" },
            checked_in_at: { type: "string", format: "date-time" },
            note: { type: "string" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Payment: {
          type: "object",
          properties: {
            id: { type: "string" },
            member_id: { type: "string" },
            subscription_id: { type: "string" },
            amount_cents: { type: "integer" },
            currency: { type: "string" },
            method: { type: "string" },
            paid_at: { type: "string", format: "date-time" },
            note: { type: "string" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
