import React from 'react';
import UInavbar from './ui-navbar.js';
import UIsidebar from './ui-sidebar.js';

import UIcalendar from './ui-calendar.js';
import UIfileEditor from './ui-fileEditor.js';
import UIfileExplorer from './ui-fileExplorer.js';
import UImaps from './ui-maps.js';
import UInotes from './ui-notes.js';

export default class Template extends React.Component {

  constructor(){
    super();
    this.state = {
      active: <UInotes />
    };
    this.toFolder= this.toFolder.bind(this);
    this.toNotes = this.toNotes.bind(this);
    this.toCalendar = this.toCalendar.bind(this);
    this.toMaps = this.toMaps.bind(this);
    this.toTrash = this.toTrash.bind(this);
    }

  toFolder(){
    this.setState({active: <UIfileExplorer />});
  }

  toNotes(){
    this.setState({active: <UInotes />});
  }

  toCalendar(){
    this.setState({active: <UIcalendar />});
  }

  toMaps(){
    this.setState({active: <UImaps />});
  }

  toTrash(){
    this.setState({active: <UIfileEditor />});
  }

  render(){
    var active = this.state.active;
    return (
      <div className="container-fluid">
          {active}
          <UInavbar />
          <UIsidebar toFolder={this.toFolder} toNotes={this.toNotes}
            toCalendar={this.toCalendar} toMaps={this.toMaps} toTrash={this.toTrash}/>
      </div>
    )
  }
}
