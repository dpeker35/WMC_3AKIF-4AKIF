import { serve } from "https://deno.land/std@0.223.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";

let todos: any[] = [];
let idCounter = 1;

console.log("✅ Server running at http://localhost:8000");

serve(async (req) => {
  const url = new URL(req.url);

  // Serve static files like /assets, /css, /js
  if (
    url.pathname.startsWith("/assets") ||
    url.pathname.startsWith("/css") ||
    url.pathname.startsWith("/js")
  ) {
    return serveDir(req, {
      fsRoot: ".",
      urlRoot: "",
      showDirListing: false,
    });
  }

  // GET /todos → return all todos
  if (url.pathname === "/todos" && req.method === "GET") {
    return new Response(JSON.stringify(todos), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // POST /todos → add a new todo
  if (url.pathname === "/todos" && req.method === "POST") {
    const body = await req.json();
    const newTodo = {
      id: idCounter++,
      text: body.text || "",
      completed: false,
      createdAt: new Date().toISOString(),
    };
    todos.push(newTodo);
    return new Response(JSON.stringify(newTodo), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // PATCH /todos/:id → update a todo
  if (url.pathname.startsWith("/todos/") && req.method === "PATCH") {
    const id = parseInt(url.pathname.split("/")[2]);
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return new Response("Not Found", { status: 404 });

    const body = await req.json();
    todos[index] = { ...todos[index], ...body };

    return new Response(JSON.stringify(todos[index]), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // DELETE /todos/:id → delete a todo
  if (url.pathname.startsWith("/todos/") && req.method === "DELETE") {
    const id = parseInt(url.pathname.split("/")[2]);
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return new Response("Not Found", { status: 404 });

    todos.splice(index, 1);
    return new Response("Deleted", { status: 200 });
  }

  // Fallback 404
  return new Response("Not Found", { status: 404 });
});
