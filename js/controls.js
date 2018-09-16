import {store} from './store.js';

class ControlCar {
    constructor(elementId, stateKey, propertyKey = 'value') {
        this.stateKey = stateKey;
        this.propertyKey = propertyKey;
        this.element = document.getElementById(elementId);
        this.element.addEventListener("input", this.update.bind(this));
        store.subscribe(this.render.bind(this));
    }

    update() {
        const value = this.element[this.propertyKey];
        const payload = this.stateKey.split('.').reverse().reduce((prev, curr) => ({[curr]: prev}), value);
        store.dispatch({
            type: 'SET_CAR', 
            payload: payload,
        });
    }

    render() {
        let state = store.getState();
        this.element[this.propertyKey] = _.get(state.car, this.stateKey);
    }
}

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