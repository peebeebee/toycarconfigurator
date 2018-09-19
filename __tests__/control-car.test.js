import {ControlCar} from '../js/control-car.js';
import {initStore, store} from '../js/store.js';

const ID_CONTROL = 'test-car-control';
let control, element, spyAddEventListener;

beforeEach(() => {
  initStore(() => { }, {car: {test: {control: 10}}});
  document.body.innerHTML = '<input id="test-car-control" type="range" value="42">';
  element = document.getElementById(ID_CONTROL);
  spyAddEventListener = jest.spyOn(element, 'addEventListener');
  store.dispatch = jest.fn();
});


describe('when constructing a ControlCar', () => {

  beforeEach(() => {
    store.subscribe = jest.fn();
    control = new ControlCar(ID_CONTROL, 'test.control');
  });

  it('should create an instance of ConstrolSave', () => {
    expect(control instanceof ControlCar).toBe(true);
  });

  it('should add an eventListener to the element', () => {
    expect(spyAddEventListener).toHaveBeenCalled();
  });

  it('should subscribe the render function to the store', () => {
    // make sure that store.subscribe is called with the render function.
    expect(Object.create(control.render.prototype) instanceof store.subscribe.mock.calls[0][0]).toBe(true);
  });
});

describe('when calling update', () => {

  beforeEach(() => {
    store.dispatch = jest.fn();
    control.update();
  });

  it('should dispatch the SET_CAR action to the store with a payload of the control value', () => {
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