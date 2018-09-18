import { ControlCar } from '../js/control.js';
import { initStore, store } from '../js/store.js';

const controlId = 'test-car-control';
let control, element, spyAddEventListener, spyStoreDispatch, spyStoreSubscribe;

beforeEach(() => {
    initStore(() => {}, {car: {test: {control: 10}}});
    document.body.innerHTML = '<input id="test-car-control" type="range" value="42">';
    element = document.getElementById(controlId);
    spyAddEventListener = jest.spyOn(element, 'addEventListener');
    store.dispatch = jest.fn();
});


describe('when constructing a Control for the Car', () => {

    beforeEach(() => {
        store.subscribe = jest.fn();
        control = new ControlCar(controlId, 'test.control');
    });

    it('should call the constructor', () => {
        expect(control instanceof ControlCar).toBe(true);
    });

    it('should add an eventListener to the element', () => {
        expect(spyAddEventListener).toHaveBeenCalled();
    });
    
    it('should subscribe to the store', () => {
        // make sure that store.subscribe is called with the render function.
        expect(Object.create(control.render.prototype) instanceof store.subscribe.mock.calls[0][0]).toBe(true);
    })
});

describe('when calling update', () => {
    
    beforeEach(() => {
        store.dispatch = jest.fn();
    });

    it('should dispatch the SET_CAR action to the store with a payload of the control value', () => {
        control.update();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SET_CAR",
            payload: {
                test: {
                    control: "42"
                }
            }
        });
    });
});