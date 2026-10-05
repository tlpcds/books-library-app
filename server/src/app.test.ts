import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./app.js";
import { owners } from "./data.js";

describe("GET /api/books", () => {
  it("returns the collection in the documented owner/book shape", async () => {
    const response = await request(app).get("/api/books");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(owners);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
  });

  it("returns a JSON not-found response for unknown routes", async () => {
    const response = await request(app).get("/api/unknown");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Not found" });
  });
});
