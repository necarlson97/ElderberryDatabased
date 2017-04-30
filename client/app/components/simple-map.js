import React from 'react';
import { Gmaps, Marker, InfoWindow } from 'react-gmaps';

export default class SimpleMap extends React.Component {
  constructor(){
    super();

    var event0 = {
      location: {
        latitude: 42.38,
        longitude: -72.521
      },

      contents: [ "Gym:",
        "Leg day",
        "Biceps",
        "Pay fees" ]
    }

    var event1 = {
      location: {
        latitude: 42.39,
        longitude: -72.511
      },

      contents: [ "Kennel:",
        "Get lacy",
        "File complaint" ]
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

  onClick(e){
    console.log('onClick', e);
  }

  onHover(e){
    console.log('onHover', e);
  }

  onDragEnd(e) {
    console.log('onDragEnd', e);
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

  }

  eventToWindow(eventIndex){
    var contents = this.state.events[eventIndex].contents;

    if(contents.length == 0) return "Empty";
    var str = "<b>"+contents[0]+"</b>";

    var i = 1;
    while(i<contents.length){
      str+="<div>"+contents[i]+"</div>";
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
