import {ControlCar} from './control-car.js';
import {ControlSave} from './control-save.js';

let controls = {};

export function initControls() {
  controls = {
    main: {
      brand: new ControlCar('app-control-main-brand', 'main.brand'),
      model: new ControlCar('app-control-main-model', 'main.model', 'checked'),
    },
    cabine: {
      color: new ControlCar('app-control-cabine-color', 'cabine.color'),
      offset: new ControlCar('app-control-cabine-offset', 'cabine.offset'),
      size: new ControlCar('app-control-cabine-size', 'cabine.size'),
    },
    body: {
      color: new ControlCar('app-control-body-color', 'body.color'),
      offset: new ControlCar('app-control-body-offset', 'body.offset'),
      size: new ControlCar('app-control-body-size', 'body.size'),
    },
    wheels: {
      color: new ControlCar('app-control-wheels-color', 'wheels.color'),
      size: new ControlCar('app-control-wheels-size', 'wheels.size'),
    },
    save: new ControlSave()
  }
}
