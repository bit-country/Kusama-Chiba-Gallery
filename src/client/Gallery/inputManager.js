// Derived from the FreeCameraMouseInput class from @babylonjs/core
// found at @babylonjs/core/Cameras/Inputs/freeCameraMouseInput.js
import { PointerEventTypes } from "@babylonjs/core";

/**
 * Defines the buttons associated with the input to handle camera move.
 */
const buttons = [0, 1, 2];
/**
 * Defines the pointer angular sensibility  along the X and Y axis or how fast is the camera rotating.
 */
const angularSensibility = 300.0;
let previousPosition = null;

const touchEnabled = false;

const _allowCameraRotation = true;

const noPreventDefault = false;

export function pointerInput(engine, camera, p) {
  const element = engine.getInputElement();

  var evt = p.event;

  if (engine.isInVRExclusivePointerMode) {
    return;
  }

  if (!touchEnabled && evt.pointerType === "touch") {
    return;
  }

  if (p.type !== PointerEventTypes.POINTERMOVE && buttons.indexOf(evt.button) === -1) {
    return;
  }

  var srcElement = (evt.srcElement || evt.target);

  if (p.type === PointerEventTypes.POINTERDOWN && srcElement) {
    try {
      srcElement.setPointerCapture(evt.pointerId);
    }
    catch (e) {
      //Nothing to do with the error. Execution will continue.
    }

    previousPosition = {
      x: evt.clientX,
      y: evt.clientY,
    };

    if (!noPreventDefault) {
      evt.preventDefault();
      element && element.focus();
    }

    // This is required to move while pointer button is down
    if (engine.isPointerLock && onMouseMove) {
      onMouseMove(camera, p.event);
    }
  }
  else if (p.type === PointerEventTypes.POINTERUP && srcElement) {
    try {
      srcElement.releasePointerCapture(evt.pointerId);
    }
    catch (e) {
      //Nothing to do with the error.
    }

    previousPosition = null;

    if (!noPreventDefault) {
      evt.preventDefault();
    }
  }
  else if (p.type === PointerEventTypes.POINTERMOVE) {
    if (!previousPosition) {
      if (engine.isPointerLock && onMouseMove) {
        onMouseMove(camera, p.event);
      }

      return;
    }

    var offsetX = evt.clientX - previousPosition.x;
    var offsetY = evt.clientY - previousPosition.y;

    if (camera.getScene().useRightHandedSystem) {
      offsetX *= -1;
    }

    if (camera.parent && camera.parent._getWorldMatrixDeterminant() < 0) {
      offsetX *= -1;
    }

    if (_allowCameraRotation) {
      camera.parent.parent.addRotation(0, offsetX / angularSensibility, 0);
      camera.parent.rotation.x += offsetY / angularSensibility;
    }

    previousPosition = {
      x: evt.clientX,
      y: evt.clientY,
    };

    if (!noPreventDefault) {
      evt.preventDefault();
    }
  }
}

function onMouseMove(camera, evt) {
  if (!engine.isPointerLock) {
    return;
  }

  if (engine.isInVRExclusivePointerMode) {
    return;
  }

  var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;

  if (camera.getScene().useRightHandedSystem) {
    offsetX *= -1;
  }

  if (camera.parent && camera.parent._getWorldMatrixDeterminant() < 0) {
    offsetX *= -1;
  }

  camera.parent.parent.addRotation(0, offsetX / angularSensibility, 0);

  var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
  camera.parent.rotation.x += offsetY / angularSensibility;

  previousPosition = null;

  if (!noPreventDefault) {
    evt.preventDefault();
  }
};