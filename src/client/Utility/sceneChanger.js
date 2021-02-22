import { Texture, Vector3 } from "@babylonjs/core";
import { SetupPlayer } from "../Gallery/gameplay";
import API from "../Integration/API";
import { getLobbyScene, getPieces, setScene } from "../Model/state";

// Related to Dynamic Canvas sizing
// Max/min dimension scales
const maxDimensionRatio = 1.25, minDimensionRatio = 0.8;
export function ChangeScene(scene) {
  setScene(scene);
  SetupPlayer();

  if (getLobbyScene() == scene) {
    API.getPieces(9).then(pieces => {
      // TODO Update to use specific collection.
      const positions = getPieces(scene);
  
      let index = 0;
      for (let piece of pieces) {
        if (index > positions.length) {
          return;
        }

        const position = positions[index++];
  
        // Dynamic Canvas
        // Allow for different aspect ratio textures.
        const image = document.createElement("img");
        image.src = piece.image;
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
  
          position.slotMaterial.diffuseTexture = new Texture(piece.image, scene);
          position.art = piece.image;
        };     
      }
    });
  }
}