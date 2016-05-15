import { ACTION_TYPES } from '../actions/index';

const INTIAL_STATE = {openTickets:[], followedTickets:[]}

export default function(state = INTIAL_STATE, action){
  switch(action.type){

    case ACTION_TYPES.FETCH_OPEN_TICKETS:
      return {...state, openTickets:action.payload.data}

    case ACTION_TYPES.FETCH_FOLLOWED_TICKETS:
      return {...state, followedTickets: action.payload.data}

    default:
      return state;
  }
}
