import React, { Component } from 'react';
import $ from 'jquery';

export default class Tickets extends Component {
  constructor(props){
    super(props);
    this.state={tickets:[]}
  }
  componentWillMount(){
  }
  handleClick(url){
    chrome.tabs.create({url});
  }
  highlightText(text){
    if(!this.props.searchString.length){
      return text;
    }
    let pattern = new RegExp(this.props.searchString, 'gi');
    let replaceText = "<span class='highlight'>$&</span>";
    return text.replace(pattern, replaceText);
  }
  renderList(){
    return this.props.list.map((ticket)=>{
      if(ticket === false){
        return;
      }
      return(
        <li className="ticket-item row" data-link={ticket.link} key={`${this.props.containerID}-${ticket.number}`} onClick={(e)=>this.handleClick(`https://www.assembla.com/${ticket.link}`)}>
        <div className="row" style={{"padding":"0 15px"}}>
          <span className="item-number"><i className="fa fa-star" /><span dangerouslySetInnerHTML={{__html: this.highlightText(ticket.number)}}/></span>
          <span className="item-summary" dangerouslySetInnerHTML={{__html: this.highlightText($.trim(ticket.summary))}} />
        </div>
        <span className="item-milestone" dangerouslySetInnerHTML={{__html: this.highlightText($.trim(ticket.milestone))}} />
        <div className="row space-row" style={{'padding': '0 15px'}}>
          <span className="item-space"><i className="fa fa-globe" /><span dangerouslySetInnerHTML={{__html: this.highlightText(ticket.space)}} /></span>
        </div>
      </li>
     )
    })

  }
  render(){
    let visClass = this.props.visible ? 'visible' : '';
    if(!this.props.list.length){
      <div className={`${visClass} ticket-list-inlay container-fluid`} id={this.props.containerID}>
        <ul className="list-ticket-list">
            <div className="load-container">
              <div className="circle"></div>
            </div>
        </ul>
      </div>
    }
    return(
      <div className={`${visClass} ticket-list-inlay container-fluid`} id={this.props.containerID}>
        <ul className="list-ticket-list">
          {this.renderList()}
        </ul>
      </div>
    )
  }
}
