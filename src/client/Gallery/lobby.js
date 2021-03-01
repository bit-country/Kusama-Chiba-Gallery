import {
  Color3,
  GlowLayer,
  HemisphericLight,
  PointerEventTypes,
  Scene, 
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { SetShowNavigator, SetShowNFTDetails, showActivePiece, ShowNavigator } from "./hud";
import Light from "../Model/Light";
import Slot from "../Model/Slot";
import { CreateSlot, SetupSlotMesh } from "../Utility/slotCreator";
import { 
  getPieces, 
  setBuildingMeshes, 
  getSections, 
  getEngine, 
  getActivePiece, 
  setActivePiece, 
  setGalleryScene, 
  addPiecePosition, 
  setActiveNavigator, 
  getLocalPlayer, 
  getActiveNavigator
} from "../Model/state";
import API from "../Integration/API";
import { FLOOR, WING } from "../constants";
import dynamicCanvas from "../Utility/dynamicCanvas";
import populatePieceDetails from "../Utility/populatePieceDetails";

// Set up the lobby scene and the associated word logic.
export default function SetupLobby() {
  const engine = getEngine();

  const scene = new Scene(engine);
  scene.gravity.y = -0.15;
  scene.hoverCursor = "none";

  scene.onPointerObservable.add(() => {
    const pickInfo = scene.pick(
      engine.getInputElement().width / 2, 
      engine.getInputElement().height / 2);

    const player = getLocalPlayer();
    
    if (!player) {
      return;
    }

    if (pickInfo.pickedMesh) {
      if (pickInfo.pickedMesh.isArt && Vector3.Distance(player.position, pickInfo.pickedMesh.position) < 10) {
        SetShowNFTDetails(true);
        setActivePiece(pickInfo.pickedMesh.ArtDetails);
      } else if (pickInfo.pickedMesh.isDoor && Vector3.Distance(player.position, pickInfo.pickedPoint) < 10) {
        SetShowNavigator(true);
        setActiveNavigator(true);
      } else {
        SetShowNFTDetails(false);
        setActivePiece(null);
        SetShowNavigator(false);
        setActiveNavigator(false);
      }   
    } else {
      SetShowNFTDetails(false);
      setActivePiece(null);
      SetShowNavigator(false);
      setActiveNavigator(false);
    }
  }, PointerEventTypes.POINTERMOVE);

  scene.onPointerObservable.add(() => {
    const piece = getActivePiece();
    const navigator = getActiveNavigator();

    if (piece) {
      showActivePiece();
    } else if (navigator) {
      ShowNavigator();
    }
  }, PointerEventTypes.POINTERUP);

  const glowLayer = new GlowLayer("GlowLayer", scene, { blurKernelSize: 64 });
  glowLayer.intensity = 1;

  setGalleryScene(scene);

  SetupSlotMesh(scene);
  
  const light = new HemisphericLight("Skylight", new Vector3(0, 1, 0), scene);
  light.diffuse = new Color3(0.2, 0.2, 0.4);
  
  SceneLoader.ImportMesh("", "/assets/Building10.gltf", "", scene, mesh => {
    setBuildingMeshes(mesh);

    for (let submesh of mesh) {
      // Names are flipped.
      if (submesh.name.includes("BottomRightWing")) {
        getSections().bottomRightWing.push(submesh);
      } else if (submesh.name.includes("BottomLeftWing")) {
        getSections().bottomLeftWing.push(submesh);
      } else if (submesh.name.includes("BottomFloor")) {
        if (submesh.name.includes("primitive9")) { // 9 is door as of building10
          submesh.isDoor = true;
        }

        getSections().bottomFloor.push(submesh);
      } else if (submesh.name.includes("TopFloorFront")) {
        getSections().topFrontWing.push(submesh);
      } else if (submesh.name.includes("TopFloorBack")) {
        getSections().topBackWing.push(submesh);
      } else if (submesh.name.includes("TopLeftWing")) {
        getSections().topLeftWing.push(submesh);
      } else if (submesh.name.includes("TopRightWing")) {
        getSections().topRightWing.push(submesh);
      } else if (submesh.name.includes("Roof")) {
        getSections().roof.push(submesh);
      }

      // Be careful not to exceed max GL vertex buffers
      if (submesh.material) {
        submesh.material.maxSimultaneousLights = 10;
        submesh.material.freeze();
      }

      submesh.checkCollisions = true;
      submesh.receiveShadows = true;
      submesh.freezeWorldMatrix();
    }

    API.getPositionsGallery().then(positions => {
      for (let slot of positions) {
        let floor = FLOOR.BOTTOM; 
        if (slot.position.y >= 3) {
          floor = FLOOR.TOP; 
        }
  
        let wing = WING.CENTRE;
        if (slot.position.z > 12) {
          wing = WING.LEFT;
        } else if (slot.position.z < -12) {
          wing = WING.RIGHT;
        } else if (slot.position.x > 10) {
          wing = WING.BACK;
        } else if (slot.position.x < -10) {
          wing = WING.FRONT;
        } // If none then it's centre
  
        let section = null;
        switch(wing) {
          case WING.CENTRE:
            section = getSections().bottomFloor;
            break;
          case WING.LEFT:
            section = floor == FLOOR.BOTTOM ? getSections().bottomLeftWing : getSections().topLeftWing;
            break
          case WING.RIGHT:
            section = floor == FLOOR.BOTTOM ? getSections().bottomRightWing : getSections().topRightWing;
            break
          case WING.FRONT:
            section = getSections().topFrontWing;
            break
          case WING.BACK:
            section = getSections().topBackWing;
            break
        }
  
        const slotInfo = CreateSlot(
          new Slot(
            new Vector3(slot.position.x, slot.position.y + slot.height / 2, slot.position.z), 
            new Vector3(slot.rotation.x, slot.rotation.y, slot.rotation.z),
            { width: slot.width, height: slot.height, depth: 0.25 }, 
            2, 
            false,
            slot._id
          ), 
          new Light(
            new Color3(slot.light.color.x, slot.light.color.y, slot.light.color.z),
            slot.light.angle
          ),
          section,
          scene
        );

        addPiecePosition(scene, slotInfo);
      }

      API.getPieces(positions.length).then(pieces => {
        const positions = getPieces(scene);
    
        let index = 0;
        for (let piece of pieces) {
          if (index > positions.length) {
            return;
          }
  
          const position = positions[index++];
    
          // Dynamic Canvas
          // Allow for different aspect ratio textures.
          dynamicCanvas(scene, position, piece.image); 
  
          populatePieceDetails(position, piece);
        }
      })
    });
  });
}
