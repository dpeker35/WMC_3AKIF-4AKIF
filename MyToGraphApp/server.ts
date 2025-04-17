// server.ts (Deno ile basit JSON API örneği - CORS destekli)
import { serve } from "https://deno.land/std@0.203.0/http/server.ts"; //library von deno

let todos: any[] = []; //innerhalb von todo wird eine list erstellt, zuerst mit let any eine leere any wird erstellt

const handler = async (req: Request): Promise<Response> => { //funktion im system, mit reqeust anfrage geschickt
  const url = new URL(req.url);

  // CORS preflight isteği için OPTIONS kontrolü
  if (req.method === "OPTIONS") { 
    return new Response(null, {
      status: 204, //mit 204 heisst das die seite funktioniert
      headers: {
        "Access-Control-Allow-Origin": "*", //jeder kann hier bearbeiten,
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

  // Root endpoint: Basit hoş geldiniz mesajı
  if (req.method === "GET" && url.pathname === "/") {
    return new Response("Welcome! /todos endpoint'ini kullanın.", { //sieht man auf der localhost:8000/ seite 
      headers: { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" },
    });
  }

  // GET /todos: Tüm to-do'ları döndür
  if (req.method === "GET" && url.pathname === "/todos") {
    return new Response(JSON.stringify(todos), { headers }); //zeig mir alles im json format von todos
  } 
  // POST /todos: Yeni to-do ekle
  else if (req.method === "POST" && url.pathname === "/todos") {
    const body = await req.json();
    body.id = Date.now();
    todos.push(body);
    return new Response(JSON.stringify(body), { headers, status: 201 }); //sieht man nur im backend, 201 heisst funktioniert
  } 
  // PATCH /todos/:id: Mevcut to-do güncelle
  else if (req.method === "PATCH" && url.pathname.startsWith("/todos/")) {
    const id = Number(url.pathname.split("/")[2]);
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return new Response("Not Found", { status: 404, headers }); //falls im json nicht gefunden dann 404 error also nicht gefunden
    const updates = await req.json(); //macht die updates und requests
    todos[index] = { ...todos[index], ...updates };
    return new Response(JSON.stringify(todos[index]), { headers });
  } 
  // DELETE /todos/:id: To-do sil
  else if (req.method === "DELETE" && url.pathname.startsWith("/todos/")) {
    const id = Number(url.pathname.split("/")[2]);
    todos = todos.filter((t) => t.id !== id);
    return new Response(null, { status: 204, headers });
  }
  
  return new Response("Not Found", { status: 404, headers });
};

console.log("HTTP webserver running. Access it at: http://localhost:8000/");
await serve(handler, {port:8000});