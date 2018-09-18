import {set as idbSet } from 'idb-keyval';
import {store} from './store.js';

export function initControls () {
    new ControlCar('app-control-main-brand', 'main.brand');
    new ControlCar('app-control-main-model', 'main.model', 'checked');
    new ControlCar('app-control-cabine-color', 'cabine.color');
    new ControlCar('app-control-cabine-offset', 'cabine.offset');
    new ControlCar('app-control-cabine-size', 'cabine.size');
    new ControlCar('app-control-body-color', 'body.color');
    new ControlCar('app-control-body-offset', 'body.offset');
    new ControlCar('app-control-body-size', 'body.size');
    new ControlCar('app-control-wheels-color', 'wheels.color');
    new ControlCar('app-control-wheels-size', 'wheels.size');
    const saveButton = document.getElementById('app-save');
    saveButton.addEventListener('click', (evt) => {
        idbSet(STORAGE_KEY, store.getState())
            .then((value) => {
            console.log('Saved: ' + value);
        });
        saveButton.classList.add('app-save--saved');
        setTimeout(() => {
            saveButton.classList.remove('app-save--saved');
        }, 500);
    });
}