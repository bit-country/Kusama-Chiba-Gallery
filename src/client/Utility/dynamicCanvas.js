import { Texture, Vector3 } from "@babylonjs/core";

// Related to Dynamic Canvas sizing
// Max/min dimension scales
const maxDimensionRatio = 1.25, minDimensionRatio = 0.8;
export default function dynamicCanvas(scene, position, imageUrl) {
  // Dynamic Canvas
  // Allow for different aspect ratio textures.
  const image = document.createElement("img");
  image.src = imageUrl;
  image.onload = () => {
    // Ratio of height to width
    const ratio = image.naturalHeight / image.naturalWidth;

    // Prevent any one dimension exceeding the max
    if (ratio > maxDimensionRatio) { // If our image is too tall
      // Find the scale of ratio to max ratio
      const difRatio = maxDimensionRatio / ratio;

      let finalXRatio, finalYRatio;
      finalXRatio = difRatio; // Reduce width to match scale
      finalYRatio = maxDimensionRatio; // Set height to max

      position.slotMesh.scaling = new Vector3(finalXRatio, finalYRatio, 1);
    } else if (ratio < minDimensionRatio) { // If our image is too wide
      // Find the difference from min ratio
      const difRatio = minDimensionRatio - ratio;

      // Find the ratio between difference and actual
      const increaseRatio = difRatio / ratio;

      let finalXRatio, finalYRatio;
      if (increaseRatio > maxDimensionRatio) { 
        // We would have to increase width beyond max to keep ratio
        // so we'll max the width and reduce the height to maintain ratio
        finalXRatio = maxDimensionRatio;
        finalYRatio = ratio * finalXRatio;
      } else {
        // We can still increase the width while keeping the height at min
        finalXRatio = 1 + increaseRatio;
        finalYRatio = minDimensionRatio;
      }
      
      position.slotMesh.scaling = new Vector3(finalXRatio, finalYRatio, 1);
    } else {
      // Current ratio won't hit any limits so we can apply easily.
      position.slotMesh.scaling = new Vector3(1, ratio, 1);
    }

    // We've completed our resizing so freeze for improved performance.
    position.slotMesh.freezeWorldMatrix();

    // TODO allow for video possibility.
    position.slotMaterial.diffuseTexture = new Texture(imageUrl, scene);
    position.art = imageUrl;
  };     
}