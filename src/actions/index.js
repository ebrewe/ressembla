import axios from 'axios';

const OPEN_TICKET_URL = "https://www.assembla.com/tickets";
const FOLLOWED_TICKET_URL = "https://www.assembla.com/followed_tickets";

export const ACTION_TYPES = {
  FETCH_OPEN_TICKETS: "FETCH_OPEN_TICKETS",
  FETCH_FOLLOWED_TICKETS: "FETCH_FOLLOWED_TICKETS"
}

export function fetchOpenTickets(){
  const request = axios.get(OPEN_TICKET_URL);

  return {
    type: ACTION_TYPES.FETCH_OPEN_TICKETS,
    payload: request
  }
}

export function fetchFollowedTickets(){
  const request = axios.get(FOLLOWED_TICKET_URL);

  return{
    type:ACTION_TYPES.FETCH_FOLLOWED_TICKETS,
    payload: request
  }
}
