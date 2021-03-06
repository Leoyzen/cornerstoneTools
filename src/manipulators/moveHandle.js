import external from '../externalModules.js';
import triggerEvent from '../util/triggerEvent.js';

export default function (mouseEventData, toolType, data, handle, doneMovingCallback, preventHandleOutsideImage) {
  const cornerstone = external.cornerstone;
  const element = mouseEventData.element;
  const distanceFromTool = {
    x: handle.x - mouseEventData.currentPoints.image.x,
    y: handle.y - mouseEventData.currentPoints.image.y
  };

  function mouseDragCallback (e, eventData) {
    if (handle.hasMoved === false) {
      handle.hasMoved = true;
    }

    handle.active = true;
    handle.x = eventData.currentPoints.image.x + distanceFromTool.x;
    handle.y = eventData.currentPoints.image.y + distanceFromTool.y;

    if (preventHandleOutsideImage) {
      handle.x = Math.max(handle.x, 0);
      handle.x = Math.min(handle.x, eventData.image.width);

      handle.y = Math.max(handle.y, 0);
      handle.y = Math.min(handle.y, eventData.image.height);
    }

    cornerstone.updateImage(element);

    const eventType = 'CornerstoneToolsMeasurementModified';
    const modifiedEventData = {
      toolType,
      element,
      measurementData: data
    };

    triggerEvent(element, eventType, modifiedEventData);
  }

  external.$(element).on('CornerstoneToolsMouseDrag', mouseDragCallback);

  function mouseUpCallback () {
    handle.active = false;
    external.$(element).off('CornerstoneToolsMouseDrag', mouseDragCallback);
    external.$(element).off('CornerstoneToolsMouseUp', mouseUpCallback);
    external.$(element).off('CornerstoneToolsMouseClick', mouseUpCallback);
    cornerstone.updateImage(element);

    if (typeof doneMovingCallback === 'function') {
      doneMovingCallback();
    }
  }

  external.$(element).on('CornerstoneToolsMouseUp', mouseUpCallback);
  external.$(element).on('CornerstoneToolsMouseClick', mouseUpCallback);
}
