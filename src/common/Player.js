/* eslint-disable */
import { Schema, defineTypes } from "@colyseus/schema";

export default class Player extends Schema {}

defineTypes(Player, {
  name: "string",
  entityId: "number",
  sessionId: "string",
  x: "number",
  y: "number",
  z: "number",
  heading: "number",
});
