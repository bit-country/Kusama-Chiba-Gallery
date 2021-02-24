/* eslint-disable */
import { Schema, MapSchema, defineTypes } from "@colyseus/schema";
import Player from "./Player.js";

export default class StateHandler extends Schema {
  constructor() {
    super();
    this.players = new MapSchema();
  }
}

defineTypes(StateHandler, {
  players: { map: Player },
});
