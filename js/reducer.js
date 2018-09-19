import merge from 'deepmerge';

export const reducer = (state = {}, action = {}) => {
  const createNewState = (changes) => Object.freeze(merge(state, changes));
  switch (action.type) {
  case 'LOAD':
    return createNewState({
      car: action.payload.car,
      loading: false
    });
  case 'SET_CAR':
    return createNewState({
      car: action.payload
    });
  case 'SET_SCENE':
    return createNewState({
      scene: action.payload
    });
  default:
    return state;
  }
}