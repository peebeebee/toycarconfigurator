const baseState = {
    car: {
        main: {
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
    },
    scene: {
        rotateX: 0,
        rotateZ: 0,
        zoom: 1
    }
}

let store, state, listeners;

export function initStore(reducer, state = baseState) {
    state = baseState; // ! remove
    state = Object.freeze(reducer(state));
    listeners = [];
    store = {};
    store.dispatch = (action) => {
        state = Object.freeze(reducer(state, action));
        listeners.forEach(fn => fn());
    }
    store.subscribe = (fn) => listeners.push(() => fn(state));
    store.getState = () => state;
}

export { store };