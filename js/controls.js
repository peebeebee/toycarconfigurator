import {store} from './store.js';

class ControlCar {
    constructor(elementId, propertyKey, getValue = (target) => target.value) {
        this.propertyKey = propertyKey;
        this.getValue = getValue
        const element = document.getElementById(elementId);
        element.addEventListener("input", this.update.bind(this));
    }

    update(evt) {
        const value = this.getValue(evt.target);
        const payload = this.propertyKey.split('.').reverse().reduce((prev, curr) => ({[curr]: prev}), value);
        store.dispatch({
            type: 'SET_CAR', 
            payload: payload,
        });
    }

    render() {}
}

export function initControls () {
    new ControlCar('app-control-main-brand', 'main.brand');
    new ControlCar('app-control-main-model', 'main.model', (target) => target.checked);
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
        localforage.setItem(STORAGE_KEY, store.getState(), (value) => {
            console.log('Using:' + localforage.driver());
            console.log('Saved: ' + value);
        });
        saveButton.classList.add('app-save--saved');
        setTimeout(() => {
            saveButton.classList.remove('app-save--saved');
        }, 500);
    });
}