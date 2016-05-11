import React, { Component } from 'react';
import TicketTab from './ticket-tab';
import $ from 'jquery';

export default class TicketList extends Component {
  constructor(props){
    super(props);
    this.state = {visibleTabs: [true, false]};
  }
  tabClick(e){
    e.preventDefault();
    if($(e.target).closest('a').hasClass('active')){
       return false;
    }
    $('.page-navigation a').removeClass('active');

    const tabs = [false, false],
          num = $(e.target).closest('a').attr('data-toggle');
    tabs[num] = true;

    $(e.target).closest('a').addClass('active');
    this.setState({visibleTabs: tabs});
  }
  render(){
    return(
      <div id="pages" className="">
        <div className="header clearfix">
            <div className="branding">
              <h1>Ressembla</h1>
            </div>
            <ul className="page-navigation list">
              <li className="list-item"><a href data-toggle="0" className="active tab-right" onClick={this.tabClick.bind(this)} title="my tickets"><i  data-toggle="0" className="fa fa-user"></i></a></li>
              <li className="list-item"><a href data-toggle="1"  onClick={this.tabClick.bind(this)} title="followed tickets"><i  data-toggle="1" className="fa fa-tags"></i></a></li>
            </ul>
        </div>
        <div id="tabs" className="container">
          <TicketTab  visible={this.state.visibleTabs[0]} ticketUrl="https://www.assembla.com/tickets" containerID="open_tickets"/>
          <TicketTab  visible={this.state.visibleTabs[1]} ticketUrl="https://www.assembla.com/followed_tickets" containerID="followed_tickets" />
        </div>
      </div>
    );
  }
}
