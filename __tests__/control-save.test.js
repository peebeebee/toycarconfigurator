import {set as idbSet} from 'idb-keyval';
import {initStore, store} from "../js/store";
import {ControlSave} from "../js/control-save";

jest.mock('idb-keyval');
idbSet.mockResolvedValue('values');

describe('ControlSave', () => {

  const ID_CONTROL = 'app-save';
  let control, element, spyAddEventListener;

  beforeEach(() => {
    initStore(() => {}, {});
    document.body.innerHTML = '<a class="app-save" id="app-save"></a>';
    element = document.getElementById(ID_CONTROL);
    spyAddEventListener = jest.spyOn(element, 'addEventListener');
  });

  describe('when calling the constructor', () => {

    beforeEach(() => {
      store.subscribe = jest.fn();
      control = new ControlSave();
    });

    it('should create an instance of ControlSave', () => {
      expect(control instanceof ControlSave).toBe(true);
    });

    it('should add an eventlistener to the right element', () => {
      expect(spyAddEventListener).toHaveBeenCalled();
    });

    it('should subscribe the render function to the store', () => {
      expect(Object.create(control.render.prototype) instanceof store.subscribe.mock.calls[0][0]).toBe(true);
    });

  });

  describe('when calling update', () => {

    beforeEach(() => {
      store.dispatch = jest.fn();
      control.update();
    });

    it('should dispatch to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'SET_SAVING',
        payload: true
      });
    });

  });

  describe('when calling render', () => {
    // todo: fill in the blanks
  });

});