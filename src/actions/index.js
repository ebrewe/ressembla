import axios from 'axios';

const TICKET_URL = "https://www.assembla.com/tickets";

export const ACTION_TYPES = {
  FETCH_TICKETS: "FETCH_TICKETS"
}

export function fetchTickets(){
  const request = axios.get(TICKET_URL);

  return {
    type: ACTION_TYPES.FETCH_TICKETS,
    payload: request
  }
}
