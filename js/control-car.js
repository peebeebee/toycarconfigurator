import {store} from './store.js';

function get(objectToTraverse, keyString) {
    return keyString.split('.').reduce((prev, curr) => {
        return (prev === undefined) ? undefined : prev[curr];
    }, objectToTraverse);
}

export class ControlCar {
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
        this.element[this.propertyKey] = get(state.car, this.stateKey);
    }
}