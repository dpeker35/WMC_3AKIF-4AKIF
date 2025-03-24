import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const student = {
    name: "John",
    age: 20,
};

const app = new Hono();

// Serve index.html
app.get("/", serveStatic({ path: "./WMC_3AKIF-4AKIF/primzahlen.html" }));
app.get("/student", async (c) => {
    return await c.json(student);
});

app.get("*", serveStatic({ root: "./static" }));

// Bind the server to 0.0.0.0 to allow external access
Deno.serve({ hostname: "0.0.0.0", port: 8000 }, app.fetch)