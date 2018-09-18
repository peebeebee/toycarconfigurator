

import {store} from './store.js';

let car, wheelDefaults;

function renderCabine(state) {
    car.cabine.style.transform = [
        `translate3D(${state.car.cabine.offset}px, 0, 0)`,
        `skew(${(state.car.main.model === true) ? '20deg' : '0deg'})`,
        `scale3d(1, ${state.car.cabine.size}, 1)`,
    ].join(' ');
    car.cabine.style.color = state.car.cabine.color;
}

function renderBody(state) {
    car.body.style.transform = [
        `translate3D(0, ${state.car.body.offset}px, 0)`,
        `skew(${(state.car.main.model === true) ? '20deg' : '0deg'})`,
        `scale3d(${state.car.body.size}, 1, 1)`,
    ].join(' ');
    car.body.style.color = state.car.body.color;
}

function renderWheels(state) {
    car.wheels.style.color = state.car.wheels.color;
    let wheels = car.wheels.querySelectorAll('.app-car-wheel').forEach((wheel, index) => {
        wheel.style.transform = [
            wheelDefaults[index],
            `scale3d(${state.car.wheels.size}, ${state.car.wheels.size}, ${state.car.wheels.size})`
        ].join(' ');
    });
}

function render() {
    const state = store.getState();
    renderCabine(state);
    renderBody(state);
    renderWheels(state);
}

export function initCar() {
    car = {
        main: document.getElementById('app-car-main'),
        cabine: document.getElementById('app-car-cabine'),
        body: document.getElementById('app-car-body'),
        wheels: document.getElementById('app-car-wheels'),
    }
    wheelDefaults = [].map.call(car.wheels.querySelectorAll('.app-car-wheel'), el => window.getComputedStyle(el).transform);
    store.subscribe(render);
}