import merge from "deepmerge";

export const reducer = (state = {}, action = {}) => {
  const createNewState = (changes) => Object.freeze(merge(state, changes));
  let newState;
  switch (action.type) {
    case "LOAD":
      newState = createNewState({
        car: action.payload.car,
        loading: false,
      });
      return newState;
    case "SET_CAR":
      newState = createNewState({
        car: action.payload,
      });
      return newState;
    case "SET_SCENE":
      newState = createNewState({
        scene: action.payload,
      });
      return newState;
    default:
      return state;
  }
};
