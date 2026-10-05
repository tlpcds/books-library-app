import { app } from "./app.js";

const port = Number.parseInt(process.env.PORT ?? "3001", 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

const server = app.listen(port, "0.0.0.0", () => {
  console.info(`Books API listening on port ${port}.`);
});

server.on("error", (error) => {
  console.error("Books API failed to start:", error);
  process.exitCode = 1;
});