import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { DocumentService } from "./services/document";

const app = new Elysia()
  .use(cors({
    origin: true,
    credentials: true,
  }))
  .use(
    swagger({
      path: "/v1/docs",
      documentation: {
        info: {
          title: "Svoy AI API Documentation",
          version: "1.0.0",
          description: "API for Personal AI Knowledge Base using RAG",
        },
      },
      scalarConfig: {
        spec: {
            url: "/v1/docs/json"
        }
      }
    })
  )

  // Base Routes
  .group("/api/v1", (app) =>
    app
      // Health Check
      .get("/health", () => ({
        status: "ready",
        server: "Bun + Elysia",
        timestamp: new Date().toISOString(),
      }))

      // Knowledge Base Routes (Placeholder sesuai kontrak)
      .group("/documents", (app) =>
        app
          .get("/", () => {
            return { message: "List of documents will be here" };
          })
          .post("/upload", async ({ body }) => {
            const { file } = body;
            return await DocumentService.processUpload(file);
          }, {
            body: t.Object({
              file: t.File(),
            }),
            type: "multipart/form-data",
            detail: {
              summary: "Upload and extract text from PDF/TXT file",
              tags: ["Document"],
            }
          })
      )

      // Query Route
      .post("/query", ({ body }) => {
        return {
          answer: `You asked: "${body.question}". AI logic coming soon!`,
          sources: []
        };
      }, {
        body: t.Object({
          question: t.String(),
          stream: t.Optional(t.Boolean())
        })
      })
  )

export default app;