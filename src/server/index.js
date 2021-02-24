import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "colyseus";
import { GameRoom } from "./GameRoom.js";
import { ConnectToDb } from "./DBConnection.js";
require("dotenv").config();

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

gameServer.define("lobby", GameRoom);

app.post("/room/new", (request, response) => {
  gameServer.define(request.body.name, GameRoom);
  console.log(`Created: ${request.body.name}`);
  return response.status(201).send(`Created: ${request.body.name}`);
});

server.listen(port);
ConnectToDb();
console.log(`Listening on ${port}`);
