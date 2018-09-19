import {get as idbGet} from 'idb-keyval';
import {initCar} from './car.js';
import {initControls} from './controls.js';
import {initStore, store} from './store.js';
import {initViewport} from './viewport.js';
import {reducer} from './reducer.js';
import {STORAGE_KEY} from './config.js';

function run(state) {
  initStore(reducer, state);
  initViewport();
  initCar();
  initControls();
  store.dispatch({
    TYPE: 'loading',
    payload: true,
  });
}

export function initialize() {
  idbGet(STORAGE_KEY).then(run, run);
}

initialize();