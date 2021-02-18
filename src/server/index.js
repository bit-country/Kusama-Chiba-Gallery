import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "colyseus";
import { GameRoom } from "./GameRoom.js";
// const http = require("http");
// const express = require("express");
// const cors = require("cors");
// const Server = require("colyseus");
// const GameRoom = require("./GameRoom.js");

// const schema = require("@colyseus/schema");
export const port = process.env.SOCKET_DEV_URL || 2657;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("./src/client/"));

// Create HTTP & WebSocket servers
const server = http.createServer(app);
const gameServer = new Server({
  server: server,
  express: app,
  pingInterval: 1000,
});

gameServer.define("gallery", GameRoom);

app.post("/room/new", (request, response) => {
  debugger;
  gameServer.define(request.body.name, GameRoom);
  console.log(`Created: ${request.body.name}`);
  return response.status(201).send(`Created: ${request.body.name}`);
});

server.listen(port);
console.log(`Listening on ${port}`);
