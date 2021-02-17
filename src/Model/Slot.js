export default class Slot {
  constructor(position, rotation, dimensions, bounds, emissive, id) {
    this.position = position;
    this.rotation = rotation;
    this.dimensions = dimensions;
    this.bounds = bounds;
    this.emissive = emissive;
    this.id = id;
  }
}