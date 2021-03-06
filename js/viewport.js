import {store} from './store.js';

let viewport, viewer, scene;

function handleMouseDown(evt) {
  viewport.ongoingMouseMove = copyMouse(evt);
}

function handleMouseUp() {
  viewport.ongoingMouseMove = undefined;
}

function handleMouseMove(evt) {
  if(!viewport.ongoingMouseMove) { return; }
  const deltaX = evt.pageX - viewport.ongoingMouseMove.pageX;
  const deltaY = evt.pageY - viewport.ongoingMouseMove.pageY;
  viewport.rotateX += deltaX;
  viewport.rotateZ -= deltaY;
  viewport.ongoingMouseMove = copyMouse(evt);
  updateScene();
}

function handleTouchStart(evt) {
  evt.preventDefault();
  [].forEach.call(evt.changedTouches, (value) => {
    viewport.ongoingTouches.push(copyTouch(value));
  });
}

function handleTouchMove(evt) {
  evt.preventDefault();
  [].forEach.call(evt.changedTouches, (touch) => {
    let idx = ongoingTouchIndexById(touch.identifier);
    if (idx >= 0) {
      const ongoingTouch = viewport.ongoingTouches[idx];
      const deltaX = touch.pageX - ongoingTouch.pageX;
      const deltaY = touch.pageY - ongoingTouch.pageY;
      viewport.rotateX += deltaX;
      viewport.rotateZ -= deltaY;
      viewport.ongoingTouches.splice(idx, 1, copyTouch(touch));  // swap in the new touch record
      updateScene();
    }
  });
}

function handleTouchEnd(evt) {
  evt.preventDefault();
  [].forEach.call(evt.changedTouches, (touch) => {
    let idx = ongoingTouchIndexById(touch.identifier);
    if (idx >= 0) {
      // do something
      viewport.ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
  });
}

function handleTouchCancel(evt) {
  evt.preventDefault();
  [].forEach.call(evt.changedTouches, (touch) => {
    let idx = ongoingTouchIndexById(touch.identifier);
    viewport.ongoingTouches.splice(idx, 1);  // remove it; we're done
  });
}

function copyTouch(touch) {
  return {
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY
  };
}

function copyMouse(evt) {
  return {
    pageX: evt.pageX,
    pageY: evt.pageY
  }
}

function ongoingTouchIndexById(idToFind) {
  return viewport.ongoingTouches.findIndex(value => value.identifier === idToFind);
}

function updateScene() {
  store.dispatch({
    type:'SET_SCENE',
    payload: {
      rotateX: viewport.rotateX,
      rotateZ: viewport.rotateZ
    }
  });
}

function render(state) {
  scene.style.transform = `rotateY(${state.scene.rotateX}deg) scale3d(1.5, 1.5, 1.5)`;
}

export function initViewport() {
  viewport = {
    ongoingTouches: [],
    ongoingMouseMove: undefined,
    scale: 1,
    rotateX: 0,
    rotateZ: 0,
  }
  viewer = document.getElementById('app-viewer');
  scene = document.getElementById('app-scene');
  viewer.addEventListener("mousedown", handleMouseDown);
  viewer.addEventListener('mousemove', handleMouseMove);
  viewer.addEventListener("mouseup", handleMouseUp);
  viewer.addEventListener("touchstart", handleTouchStart, false);
  viewer.addEventListener("touchend", handleTouchEnd, false);
  viewer.addEventListener("touchcancel", handleTouchCancel, false);
  viewer.addEventListener("touchmove", handleTouchMove, false);
  store.subscribe(render);
}