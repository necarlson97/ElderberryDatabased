import React from 'react';
import { Gmaps, Marker, InfoWindow } from 'react-gmaps';
import {getMasterFolderData, getContentItem} from '../server.js';

export default class SimpleMap extends React.Component {
  constructor(){
    super();

    var event0 = {
      location: {
        latitude: 42.38,
        longitude: -72.521
      },

      contents: "none 1"
    }

    var event1 = {
      location: {
        latitude: 42.39,
        longitude: -72.511
      },

      contents: "none 2"
    }

    this.state = {
      viewLocation: {
        latitude: null,
        longitude: null
      },

      events: [event0, event1],

      windowArray: [],
      markerArray: []
    };

    this.showWindow = this.showWindow.bind(this);
    this.gotData = this.gotData.bind(this);
  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true,
      panControl:true,
      zoomControl:true,
      mapTypeControl:true,
      scaleControl:true,
      streetViewControl:true,
      overviewMapControl:true,
      rotateControl:true,
      zoom:13
    });
  }

  showWindow(windowIndex) {
    console.log('showWindow', windowIndex);
    var that = this;
    return function() {
      var newWindow =
        <InfoWindow
          lat={that.state.events[windowIndex].location.latitude}
          lng={that.state.events[windowIndex].location.longitude}
          content={that.eventToWindow(windowIndex)}/>
      ;

      var newWindowArray = that.state.windowArray;

      if(newWindowArray.indexOf(newWindow) == -1) newWindowArray.push(newWindow);
      that.setState({windowArray: newWindowArray});
    }
  }

  getUserNotes(userId) {
    var userNotes = getMasterFolderData(userId, (Data) => {
      this.gotData(Data);
    });
  }

  gotData(data){
    console.log("gotData: ",data.contents);
    var userNotes = data.contents;

    var newState = this.state;

    for(var i=0; i<userNotes.length; i++){
      var noteString = userNotes[i].contents.contents;
      console.log("note ",i," : ",noteString)
      newState.events[i].contents = noteString;
    }
    console.log("New State: ",newState)
    this.setState(newState);
    console.log("State: ",this.state)
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(location => {
      this.setState({viewLocation: location.coords});
    });
  }

  componentDidMount() {
    var newMarkerArray = this.state.markerArray;

    for(var i=0; i<this.state.events.length; i++){
      var newMarker =
        <Marker
          lat={this.state.events[i].location.latitude}
          lng={this.state.events[i].location.longitude}
          draggable={true}
          onClick={this.showWindow(i)}/>
      ;

      newMarkerArray.push(newMarker);
    }
    this.setState({markerArray: newMarkerArray});

    this.getUserNotes(4);
  }

  eventToWindow(eventIndex){
    var contents = this.state.events[eventIndex].contents;
    console.log("event index ", eventIndex, "found ", contents)
    var splitContents = contents.split("\n");
    var str = "<b>"+splitContents[0]+"</b>";

    if(splitContents.length < 2) return str;

    var i = 1;
    while(i<splitContents.length){
      str+="<div>"+splitContents[i]+"</div>";
      i++;
    }
    return str;
  }

  render(){

    return (
      <div>
        <Gmaps
          width={'900'}
          height={'500'}
          lat={this.state.viewLocation.latitude}
          lng={this.state.viewLocation.longitude}
          loadingMessage={'Loading...'}
          onMapCreated={this.onMapCreated}
          onDragEnd={this.onDragEnd}>
          <InfoWindow
            lat={this.state.viewLocation.latitude}
            lng={this.state.viewLocation.longitude}
            content={"<div> You are Here! </div>"}/>
          {this.state.markerArray}
          {this.state.windowArray}
        </Gmaps>

      </div>
      );
  }
}
