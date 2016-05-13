import React, { Component } from 'react';
//import { connect } from 'react-redux';
//import {fetchTickets} from '../actions/index';
import $ from 'jquery';
import _ from 'lodash';

export default class TicketTab extends Component {
  constructor(props){
    super(props);
    this.state = {tickets: []}; 
  }
  componentWillMount(){
    var self= this;
    this.url = "";
      $.get(this.props.ticketUrl)
      .success((data)=>{
        this.parseData(data);
      })
  }
  setLocalStorage(key, item){
    var self = this;
    let obj ={}
    obj[key] = item
    let storage = chrome.storage.local;
    storage.get(key, (result)=>{
      storage.set(obj);
    });

  }
  parseData(data){
    var self = this;
     var el = document.createElement('html'),
         tEl = document.getElementById(this.props.containerID);
         el.innerHTML = data;
      let links = [];
       $(el).find('tr[id^="ticket_"]').each(function(){
          let link= $(this).attr('data-linkUrl'),
              number = getItemNumber($(this).find('td.number').find('p').text()),
              summary = $(this).find('.summary').find('.list-column-wrapper').text(),
              milestone = $(this).find('.milestone_id').find('.list-column-wrapper').text(),
              space = $(this).closest('table.listing.tickets').prev('div.s-table-header').attr('data-group-id');
              links.push({link, number, summary, milestone, space}); 
       });
      function getItemNumber(numStr){
        return numStr.match( /\d+/g );
      }
      this.setLocalStorage(`ressembla-${this.props.containerID}`, links);
      this.setState({tickets: links})
  }
  handleClick(url){
    chrome.tabs.create({url});
  }
  renderTickets(){
    return (
      this.state.tickets.map( (ticket)=>{
        return(
          <li className="ticket-item row" data-link={ticket.link} key={`ticket-${ticket.number}`} onClick={(e)=>this.handleClick(`https://www.assembla.com/${ticket.link}`)}>
            <div className="row" style={{"padding":"0 15px"}}>
              <span className="item-number"><i className="fa fa-star" />{ticket.number}</span>
              <span className="item-summary">{$.trim(ticket.summary)}</span>
            </div>
            <span className="item-milestone">{$.trim(ticket.milestone)}</span>
            <div className="row space-row" style={{'padding': '0 15px'}}>
              <span className="item-space"><i className="fa fa-globe" />{ticket.space}</span>
            </div>
          </li>
        )
      })
    )
  }
  render(){
    const visClass = this.props.visible ? 'visible' : '';
    if(!this.state.tickets.length){
        return(
        <div className={`${visClass} ticket-list-inlay container-fluid`} id={this.props.containerID}>
          <ul className="list-ticket-list">
              <div className="load-container">
                <div className="circle"></div>
              </div>
          </ul>
        </div>
        );
    }
    return(
        <div className={`${visClass} ticket-list-inlay container-fluid`} id={this.props.containerID}>
          <ul className="list-ticket-list">
            {this.renderTickets()}
          </ul>
        </div>
    );
  }
}

//export default connect(null, {fetchTickets})(TicketTab)