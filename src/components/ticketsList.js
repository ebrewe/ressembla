import React, { Component } from 'react';
import {fetchOpenTickets, fetchFollowedTickets} from '../actions/index';
import $ from 'jquery';
import { connect } from 'react-redux';
import Tickets from './tickets';

class TicketsList extends Component {
  constructor(props){
    super(props);
    this.state={visibleTabs:[true, false], searchString:''};
  }
  componentWillMount(){
    this.props.fetchOpenTickets();
    this.props.fetchFollowedTickets();
  }
  handleInputChange(e){
    this.setState({searchString: e.target.value});
  }
  parseData(data){
     var self = this;
     var el = document.createElement('html');
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
        var tempStr = numStr.match( /\d+/g );
        return tempStr.length? tempStr[0] : tempStr;
      }
      //this.setLocalStorage(`ressembla-${this.props.containerID}`, links);
      return links;
  }
  tabClick(e, num){
    e.preventDefault();
    if($(e.target).closest('a').hasClass('active')){
       return false;
    }
    $('.page-navigation a').removeClass('active');

    const tabs = [false, false];
    tabs[num] = true;

    $(e.target).closest('a').addClass('active');
    this.setState({visibleTabs: tabs});
  }
  filterResults(list){
    const filter = new RegExp(this.state.searchString, 'ig');
    return list.map((item)=>{
      if(item.number.match(filter) || item.summary.match(filter) || item.milestone.match(filter) || item.space.match(filter)){
        return item;
      }
      return false
    });
  }
  render(){
    var tickets = {open:[], followed:[]}
    if(this.props.openTickets.length > 0){
      tickets.open = this.filterResults(this.parseData(this.props.openTickets));
    }
    if(this.props.followedTickets.length > 0){
      tickets.followed = this.filterResults(this.parseData(this.props.followedTickets));
    }
    console.log(`open: ${tickets.open} followed:${tickets.followed}`);
    return(
      <div id="pages" className="">
        <div className="header clearfix">
            <div className="branding">
              <h1>Assemb<span className="accent">{"{"}</span>list<span className="accent">{"}"}</span></h1>
            </div>
            <ul className="page-navigation list">
              <li className="list-item"><a href className="active tab-right" onClick={(e)=>{this.tabClick(e, 0)}} title="my tickets">Open Tickets</a></li>
              <li className="list-item"><a href onClick={(e)=>{this.tabClick(e, 1)}} title="followed tickets">Followed Tickets</a></li>
              <li className="list-item list-item-search">
                <div className="search">
                  <i className="fa fa-search" />
                  <input className="input-search" id="search" value={this.state.searchString} onChange={this.handleInputChange.bind(this)} />
                </div>
              </li>
            </ul>
        </div>
        <div id="tabs" className="container">
          <Tickets visible={this.state.visibleTabs[0]} list={tickets.open} containerID="open_tickets" searchString={this.state.searchString} />
          <Tickets visible={this.state.visibleTabs[1]}  list={tickets.followed} containerID="followed_tickets" searchString={this.state.searchString} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {openTickets: state.tickets.openTickets, followedTickets:state.tickets.followedTickets}
}

export default connect(mapStateToProps, {fetchFollowedTickets, fetchOpenTickets})(TicketsList);
