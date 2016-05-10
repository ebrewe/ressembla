import React, { Component } from 'react';
import $ from 'jquery';

export default class TicketTab extends Component {
  componentWillMount(){
    console.log(this.props.ticketUrl, this.props.containerID);
    var self= this;
    this.url = "";

      $.get(this.props.ticketUrl)
      .success((data)=>{
        this.parseData(data);
        this.reStyle();
      })
  }
  parseData(data){
     var el = document.createElement('html'),
         tEl = document.getElementById(this.props.containerID);
         el.innerHTML = data;
      let links = [];
         $(el).find('tr[id^="ticket_"]').each(function(){
            let link= $(this).attr('data-linkUrl'),
                number = $(this).find('td.number').find('p').text(),
                summary = $(this).find('.summary').find('.list-column-wrapper').text(),
                milestone = $(this).find('.milestone_id').find('.list-column-wrapper').text();
                links.push({link, number, summary, milestone}); 
         })
      var markup="";
      links.map((item)=>{
        var numberClass = item.milestone ? 'col-sm-2' : 'col-sm-4',
            summaryClass = item.milestone ? 'col-sm-5' : 'col-sm-10',
            milestoneClass = item.milestone ? 'col-sm-5' : ''; 

        markup += "<li class='ticket-item row' data-link='" + item.link +"' id='" + item.number + "'>" +
            '<span class="'+numberClass+' item-number">' +item.number + '</span>' +
            '<span class="'+summaryClass+' item-summary">'+item.summary + '</span>' +
            '<span class="'+milestoneClass+' item-milestone">'+item.milestone+'</span>' +
            '</li>';
        
      });
      $('#'+this.props.containerID).find('ul').html(markup);
      $('li.ticket-item').on('click', function(e){

         var url = `https://www.assembla.com/${$(this).attr('data-link')}`;
         if(self.url != url){
          chrome.tabs.create({url});
          self.url = url;
         }
         return false;
      }); 
  }
  reStyle(){
    $('#' + this.props.containerID +' .navigation-wrapper').css('display', 'none');
  }
  render(){
    const visClass = this.props.visible ? 'visible' : '';
    return(
      <div className={`${visClass} ticket-list-inlay container-fluid`} id={this.props.containerID}>
        <ul className="list-ticket-list">

        </ul>
      </div>
    );
  }
}
