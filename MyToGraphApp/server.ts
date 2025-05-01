// server.ts (Deno ile basit JSON API örneği - CORS destekli)
import { getQuote } from "./quote.ts";
import { serve } from "https://deno.land/std@0.203.0/http/server.ts"; //library von deno

let todos: any[] = []; //innerhalb von todo wird eine list erstellt

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  // CORS preflight isteği için OPTIONS kontrolü
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Ortak header'lar
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  // Root endpoint: Hoş geldiniz mesajı
  if (req.method === "GET" && url.pathname === "/") {
    return new Response("Welcome! /todos endpoint'ini kullanın.", {
      headers: { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" },
    });
  }

  // GET /api/quote: Get a random quote
  if (req.method === "GET" && url.pathname === "/api/quote") {
    const quote = await getQuote();
    return new Response(JSON.stringify(quote), { headers });
  }

  // GET /todos: Tüm to-do'ları döndür
  if (req.method === "GET" && url.pathname === "/todos") {
    return new Response(JSON.stringify(todos), { headers });
  }

  // POST /todos: Yeni to-do ekle
  else if (req.method === "POST" && url.pathname === "/todos") {
    const body = await req.json();
    body.id = Date.now();
    todos.push(body);
    return new Response(JSON.stringify(body), { headers, status: 201 });
  }

  // PATCH /todos/:id: Mevcut to-do güncelle
  else if (req.method === "PATCH" && url.pathname.startsWith("/todos/")) {
    const id = Number(url.pathname.split("/")[2]);
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return new Response("Not Found", { status: 404, headers });
    const updates = await req.json();
    todos[index] = { ...todos[index], ...updates };
    return new Response(JSON.stringify(todos[index]), { headers });
  }

  // DELETE /todos/:id: To-do sil
  else if (req.method === "DELETE" && url.pathname.startsWith("/todos/")) {
    const id = Number(url.pathname.split("/")[2]);
    todos = todos.filter((t) => t.id !== id);
    return new Response(null, { status: 204, headers });
  }

  // Unknown endpoint fallback
  return new Response("Not Found", { status: 404, headers });
};

console.log("HTTP webserver running. Access it at: http://localhost:8000/");
await serve(handler, { port: 8000 });
