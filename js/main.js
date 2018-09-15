import { initStore } from './store.js';
import { initControls } from './controls.js';
import { initCar } from './car.js';
import { initViewport } from './viewport.js';
import { reducer } from './reducer.js';
import { store } from './store.js';

const STORAGE_KEY = 'toyCarConfiguratorConfig';

function run(state = baseState) {
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
    localforage.getItem(STORAGE_KEY).then(run, run);
}

