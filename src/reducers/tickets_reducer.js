import { ACTION_TYPES } from '../actions/index';

const INTIAL_STATE = {tickets: null}

export default function(state = INTIAL_STATE, action){
  console.log(action, action.payload, state)
  switch(action.type){

    case ACTION_TYPES.FETCH_TICKETS:
      return state

    default:
      return state;
  }
}
