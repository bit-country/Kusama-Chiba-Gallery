/* eslint-disable */
import { Schema, ArraySchema, defineTypes } from "@colyseus/schema";

class PlayerName extends Schema {}
defineTypes(PlayerName, {
  name: "string",
});

export default class WaitingRoom extends Schema {
  constructor() {
    super();
    this.players = new ArraySchema();
  }
}

defineTypes(WaitingRoom, {
  players: [PlayerName],
});
