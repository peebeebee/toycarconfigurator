import {ControlCar} from './control-car.js';
import {ControlSave} from './control-save.js';

export function initControls() {
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
  new ControlSave();
}

