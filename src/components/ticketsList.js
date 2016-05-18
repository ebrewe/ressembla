import React, { Component } from 'react';
import {fetchOpenTickets, fetchFollowedTickets} from '../actions/index';
import $ from 'jquery';
import { connect } from 'react-redux';
import Tickets from './tickets';
import ReactDOM from 'react-dom';

class TicketsList extends Component {
  constructor(props){
    super(props);
    this.state={visibleTabs:[true, false], searchString:''};
  }
  componentWillMount(){
    this.props.fetchOpenTickets();
    this.props.fetchFollowedTickets();
  }
  componentDidMount(){
    ReactDOM.findDOMNode(this.refs.searchInput).focus();
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
  handleKeyDown(e){
    const code = e.keyCode;
    const keycodes = { up:38, down:40, tab:9, enter:13, shift:16, left:37, right:39};
    let actionKey = false;
    for(let i in keycodes){
      if (code == keycodes[i]) {
        actionKey = true;
      }
    }
    if(!actionKey){
      $('#search').focus();
    }else{
      if(code == keycodes.left){
        if($('#search').is(':focus')){
          $('.nav-followed-tickets').focus();
        }else{
          $('.nav-open-tickets  ').focus();
        }
      }
      if(code == keycodes.right){
        if($('.nav-open-tickets ').is(':focus')){
          $('.nav-followed-tickets').focus();
        }else{
          $('#search').focus();
        }
      }
      if(code == keycodes.down){
         e.preventDefault();
         const allInputs = $("input,.visible a");
         let currentTab = e.target;
         let nextTab = currentTab;
         if(currentTab.className == 'nav-followed-tickets' || currentTab.className == 'nav-open-tickets') nextTab = allInputs[1]; 
          for(let i = 0; i < allInputs.length; i++){
            if(currentTab == allInputs[i] && i + 1 < allInputs.length) {
              nextTab = allInputs[i + 1] 
            }
          }
          $('.has-focus').removeClass('has-focus');
          $(nextTab).focus();
          $(nextTab).closest('li').addClass('has-focus'); 
      }
      if(code == keycodes.up){
         e.preventDefault();
         const allInputs = $("input,.visible a");
         let currentTab = e.target;
         let nextTab = currentTab;
          for(let i = 0; i < allInputs.length; i++){
            if(currentTab == allInputs[i] && i - 1 >= 0) {
              nextTab = allInputs[i - 1] 
            }
          }
          $('.has-focus').removeClass('has-focus');
          $(nextTab).focus();
          $(nextTab).closest('li').addClass('has-focus'); 
      }
    }
  }
  render(){
    var tickets = {open:[], followed:[]}
    if(this.props.openTickets.length > 0){
      tickets.open = this.filterResults(this.parseData(this.props.openTickets));
    }
    if(this.props.followedTickets.length > 0){
      tickets.followed = this.filterResults(this.parseData(this.props.followedTickets));
    }
    return(
      <div id="pages" className="" onKeyDown={this.handleKeyDown.bind(this)}>
        <div className="header clearfix">
            <div className="branding">
              <h1>Assemb<span className="accent">{"{"}</span>list<span className="accent">{"}"}</span></h1>
            </div>
            <ul className="page-navigation list">
              <li className="list-item"><a href className="active tab-right nav-open-tickets" onClick={(e)=>{this.tabClick(e, 0)}} title="my tickets">Open Tickets</a></li>
              <li className="list-item"><a href className="nav-followed-tickets" onClick={(e)=>{this.tabClick(e, 1)}} title="followed tickets">Followed Tickets</a></li>
              <li className="list-item list-item-search">
                <div className="search">
                  <i className="fa fa-search" />
                  <input className="input-search" id="search" ref="searchInput" value={this.state.searchString} onChange={this.handleInputChange.bind(this)} />
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
