import { combineReducers } from 'redux';
import TicketReducer from './tickets_reducer';

const rootReducer = combineReducers({
  tickets: TicketReducer
});


export default rootReducer;
