import {STORAGE_KEY} from './config.js';

import {set as idbSet} from 'idb-keyval';
import {store} from './store.js';

export class ControlSave {

  constructor() {
    this.element = document.getElementById('app-save');
    this.element.addEventListener('click', this.update.bind(this));
    store.subscribe(this.render.bind(this));
  }

  update() {
    const setSaving = (bool) => {
      console.log('sdfsdfsfsafsdf');
      store.dispatch({
        type: 'SET_SAVING',
        payload: bool
      })
    }
    setSaving(true);
    idbSet(STORAGE_KEY, store.getState()).then((value) => {
      console.log('sdfsfsfsdf', value);
      requestAnimationFrame(() => setSaving(false));
    });
  }

  render() {
    const state = store.getState();
    if(state.saving) {
      this.element.classList.add('app-save--saved');
    }
    else {
      this.element.classList.remove('app-save--saved');
    }
  }
}