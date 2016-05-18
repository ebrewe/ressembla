import React from 'react'; 
import App from './components/app';
import { Route, IndexRoute } from 'react-router';
import ShowTicket from './components/show-ticket';
import TicketsList from './components/ticketsList';


export default(
		<Route path="/" component={App}>
			<IndexRoute component={TicketsList} />
			<Route path="ticket/:id" component={ShowTicket} />
		</Route>
)