class App {
    constructor(store) {
        const controls = new Controls(store);
        const viewport = new Viewport(store);
        const renderer = new Renderer(store);
        renderer.update();
    }
}

class Store {
    constructor(reducer, baseState) {
        this.listeners = [];
        this.reducer = reducer;
        this.state = reducer(baseState);
    }
        
    dispatch(action) {
        this.state = this.reducer(this.state, action);
        this.listeners.forEach(listener => listener());
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    getState() {
        return this.state;
    }
}


class Controls {
    constructor(store) {
        this.store = store;
        this.controls = {
            car: {
                brand: document.getElementById('app-control-car-brand'),
                model: document.getElementById('app-control-car-model'),
            },
            cabine: {                
                color: document.getElementById('app-control-cabine-color'),
                offset: document.getElementById('app-control-cabine-offset'),
                size: document.getElementById('app-control-cabine-size'),
            },
            body: {
                color: document.getElementById('app-control-body-color'),
                offset: document.getElementById('app-control-body-offset'),
                size: document.getElementById('app-control-body-size'),
            },
            wheels: {
                color: document.getElementById('app-control-wheels-color'),
                size: document.getElementById('app-control-wheels-size'),
            }
        };
        this.listenTo(this.controls.car, this.updateCar.bind(this));
        this.listenTo(this.controls.cabine, this.updateCabine.bind(this));
        this.listenTo(this.controls.body, this.updateBody.bind(this));
        this.listenTo(this.controls.wheels, this.updateWheels.bind(this));
    }

    listenTo(controls, listener) {
        _.each(controls, el => el.addEventListener("input", listener));
    }

    updateCar() {
        this.store.dispatch({
            type: 'SET_CAR', 
            payload: {
                brand: this.controls.car.brand.value,
                model: this.controls.car.model.checked,
            }
        });
    }

    updateCabine() {
        this.store.dispatch({
            type: 'SET_CABINE', 
            payload: {
                color: this.controls.cabine.color.value,
                offset: this.controls.cabine.offset.value,
                size: this.controls.cabine.size.value,
            }
        });
    }
    
    updateBody() {
        this.store.dispatch({
            type: 'SET_BODY',
            payload: {
                color: this.controls.body.color.value,
                offset: this.controls.body.offset.value,
                size: this.controls.body.size.value,
            }
        })
    }

    updateWheels() {
        this.store.dispatch({
            type: 'SET_WHEELS',
            payload: {
                color: this.controls.wheels.color.value,
                size: this.controls.wheels.size.value,
            }
        })
    }

}

class Viewport {

    constructor(store) {
        this.store = store;
        const viewer = document.getElementById('app-viewer');
        viewer.addEventListener("mousedown", this.handleMouseDown.bind(this));
        viewer.addEventListener('mousemove', this.handleMouseMove.bind(this));
        viewer.addEventListener("mouseup", this.handleMouseUp.bind(this));
        viewer.addEventListener("touchstart", this.handleTouchStart.bind(this), false);
        viewer.addEventListener("touchend", this.handleTouchEnd.bind(this), false);
        viewer.addEventListener("touchcancel", this.handleTouchCancel.bind(this), false);
        viewer.addEventListener("touchmove", this.handleTouchMove.bind(this), false);
        this.ongoingTouches = [];
        this.ongoingMouseMove = undefined;
        this.scale = 1;
        this.rotateX = 0;
        this.rotateZ = 0;
    }

    handleMouseDown(evt) {
        this.ongoingMouseMove = this.copyMouse(evt);
    }

    handleMouseUp(evt) {
        this.ongoingMouseMove = undefined;
    }

    handleMouseMove(evt) {
        if(!this.ongoingMouseMove) return;
        const deltaX = evt.pageX - this.ongoingMouseMove.pageX;
        const deltaY = evt.pageY - this.ongoingMouseMove.pageY;
        this.rotateX += deltaX;
        this.rotateZ -= deltaY;
        this.ongoingMouseMove = this.copyMouse(evt);
        this.updateScene();
    };

    handleTouchStart(evt) {
        evt.preventDefault();
        console.log("touchstart.", evt.changedTouches);
        _.each(evt.changedTouches, (value, index) => {
            this.ongoingTouches.push(this.copyTouch(value));
            console.log("touchstart:" + index + ".");
        });
    }

    handleTouchMove(evt) {
        evt.preventDefault();
        _.each(evt.changedTouches, (touch) => {
            let idx = this.ongoingTouchIndexById(touch.identifier);
            if (idx >= 0) {
                const ongoingTouch = this.ongoingTouches[idx];
                const deltaX = touch.pageX - ongoingTouch.pageX;
                const deltaY = touch.pageY - ongoingTouch.pageY;
                this.rotateX += deltaX;
                this.rotateZ -= deltaY;
                console.log("continuing touch ", this.rotateX, this.rotateZ);
                this.ongoingTouches.splice(idx, 1, this.copyTouch(touch));  // swap in the new touch record
                this.updateScene();
            } else {
                console.log("can't figure out which touch to continue");
            }
        });
    }

    handleTouchEnd(evt) {
        evt.preventDefault();
        console.log("touchend");
        _.each(evt.changedTouches, (touch) => {
            let idx = this.ongoingTouchIndexById(touch.identifier);
            if (idx >= 0) {
                // do something
                this.ongoingTouches.splice(idx, 1);  // remove it; we're done
            } else {
                console.log("can't figure out which touch to end");
            }
        });
    }

    handleTouchCancel(evt) {
        evt.preventDefault();
        console.log("touchcancel.");
        _.each(evt.changedTouches, (touch) => {
            var idx = this.ongoingTouchIndexById(touch.identifier);
            this.ongoingTouches.splice(idx, 1);  // remove it; we're done
        });
    }

    copyTouch(touch) {
        return {
            identifier: touch.identifier,
            pageX: touch.pageX,
            pageY: touch.pageY
        };
    }

    copyMouse(evt) {
        return {
            pageX: evt.pageX,
            pageY: evt.pageY
        }
    }

    ongoingTouchIndexById(idToFind) {
        return this.ongoingTouches.findIndex(value => value.identifier == idToFind);
    }

    updateScene() {
        this.store.dispatch({
            type:'SET_SCENE',
            payload: {
                rotateX: this.rotateX,
                rotateZ: this.rotateZ
            }
        });
    }

}

class Renderer {

    constructor(store) {
        store.subscribe(this.update.bind(this));
        this.store = store;
        this.car = document.getElementById('app-car-');
        this.cabine = document.getElementById('app-car-cabine');
        this.body = document.getElementById('app-car-body');
        this.wheels = document.getElementById('app-car-wheels');
        this.scene = document.getElementById('app-scene');
        this.wheelDefaults = _.map(this.wheels.querySelectorAll('.app-car-wheel'), el => window.getComputedStyle(el).transform);
    }

    update() {
        // We don't need any deepchecking, because everything is done through CSS Hardware optimised attributes
        const state = this.store.getState();
        this.updateCar(state);
        this.updateCabine(state);
        this.updateBody(state);
        this.updateWheels(state);
        this.setScene(state);
    }

    updateCar(state) {
        console.log('state', state);
    }

    updateCabine(state) {
        this.cabine.style.transform = [
            `translate3D(${state.cabine.offset}px, 0, 0)`,
            `skew(${(state.car.model === true) ? '20deg' : '0deg'})`,
            `scale3d(1, ${state.cabine.size}, 1)`,
        ].join(' ');
        this.cabine.style.color = state.cabine.color;
    }

    updateBody(state) {
        this.body.style.transform = [
            `translate3D(0, ${state.body.offset}px, 0)`,
            `skew(${(state.car.model === true) ? '20deg' : '0deg'})`,
            `scale3d(${state.body.size}, 1, 1)`,
        ].join(' ');
        this.body.style.color = state.body.color;
    }

    updateWheels(state) {
        let x = `scale3d(1.5, 1.5, 1.5)`;
        this.wheels.style.color = state.wheels.color;
        let wheels = this.wheels.querySelectorAll('.app-car-wheel').forEach((wheel, index) => {
            console.log('wtf', this.wheelDefaults[index]);
            let xxx = [
                this.wheelDefaults[index],
                `scale3d(${state.wheels.size}, ${state.wheels.size}, ${state.wheels.size})`
            ].join(' ');
            console.log('xxx', xxx);
            wheel.style.transform = xxx;
        });
    }

    setScene(state) {
        this.scene.style.transform = `rotateY(${state.scene.rotateX}deg) scale3d(1.5, 1.5, 1.5)`;
    }

}

const reducers = {
    car: (state, action) => {
        return (action.type === 'SET_CAR') ? action.payload : state;
    },
    cabine: (state, action) => {
        return (action.type === 'SET_CABINE') ? action.payload : state;
    },
    body: (state, action) => {
        return (action.type === 'SET_BODY') ? action.payload : state;
    },
    wheels: (state, action) => {
        return (action.type === 'SET_WHEELS') ? action.payload : state;
    },
    scene: (state, action) => {
        return (action.type === 'SET_SCENE') ? action.payload: state;
    }
}

const createReducer = (id) => {
    return (state, action) => action.type === 'id' ? action.payload : state;
}

const appReducer = (state = {}, action = {}) => {
    return {
        car: reducers.car(state.car, action),
        cabine: reducers.cabine(state.cabine, action),
        body: reducers.body(state.body, action),
        wheels: reducers.wheels(state.wheels, action),
        scene: reducers.scene(state.scene, action),
    };
}

const baseState = {
    car: {
        brand: 0,
        type: 'racecar'
    },
    cabine: {
        color: '#d4e0e6',
        offset: 0,
        size: 1,
    },
    body: {
        color: '#e65757',
        offset: 1,
        size: 1,
    },
    wheels: {
        color: '#ffef00',
        size: 1,
    },
    scene: {
        rotateX: 0,
        rotateZ: 0,
        zoom: 1
    }
}
const store = new Store(appReducer, baseState);
const app = new App(store);
