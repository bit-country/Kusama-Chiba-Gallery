/* eslint-disable */
import { Schema, MapSchema, defineTypes } from "@colyseus/schema";
import Player from "./Player.js";
import WaitingRoom from "./WaitingRoom.js";

export default class StateHandler extends Schema {
  constructor() {
    super();
    this.players = new MapSchema();
    //  this.waitingRoom = new CollectionSchema();
  }
}

defineTypes(StateHandler, {
  players: { map: Player },
  waitingRoom: WaitingRoom,
});
