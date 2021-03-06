import { ShadowGenerator, SpotLight, Vector3 } from "@babylonjs/core";

export function CreateLight(slotDimensions, light, parentMesh, containingMeshes, scene) {
  const artLight = new SpotLight(
    "ArtLight", 
    new Vector3(0, slotDimensions.height + 0.5, -(slotDimensions.depth + 1)), 
    new Vector3(0, -1, 0.4), 
    light.angleInRadians ?? Math.PI / 3, 
    32,
    scene
  );
  artLight.intensity = 4;
  artLight.range = 6;
  artLight.parent = parentMesh;
  artLight.shadowMinZ = 1;
  artLight.shadowMaxZ = 10;
  artLight.diffuse = light.colour;

  // const shadowGenerator = new ShadowGenerator(128, artLight);
  // shadowGenerator.addShadowCaster(parentMesh);
  // for (let mesh of containingMeshes) {
  //   shadowGenerator.addShadowCaster(mesh);
  // }

  // shadowGenerator.useBlurExponentialShadowMap = false;
  // shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_LOW;

  return artLight;
}