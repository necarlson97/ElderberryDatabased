import React from 'react';
import {unixTimeToString} from './util.js';

  export default class Trash extends React.Component{
    constructor(props) {
      super(props);
      this.state = props.data;
    }

    render(){
      var data = this.state;
      if(data.type == "note"){
        return(
      <tr>
        <td className="text-center"><span className="glyphicon glyphicon-file"></span></td>
        <td>{data.title}</td>
        <td className="text-center">
          <a href="#"><span className="btn btn-sm btn-danger glyphicon glyphicon-trash"></span></a>
          <a href="#"><span className="btn btn-sm btn-primary glyphicon glyphicon-pencil"></span></a>
        </td>
        <td>{unixTimeToString(data.contents.postDate)}</td>
      </tr>
      )
    }
    if(data.type == "folder"){
      return(
        <tr>
        <td className="text-center"><span className="glyphicon glyphicon-folder-close"></span></td>
        <td>{data.title}</td>
        <td className="text-center">
          <a href="#"><span className="btn btn-sm btn-danger glyphicon glyphicon-trash"></span></a>
          <a href="#"><span className="btn btn-sm btn-primary glyphicon glyphicon-pencil"></span></a>
        </td>
        <td>{unixTimeToString(data.contents.postDate)}</td>
      </tr>
      )
    }
    if(data.type == "picture"){
      return(
        <tr>
          <td className="text-center"><span className="glyphicon glyphicon-picture"></span></td>
          <td>{data.title}</td>
          <td className="text-center">
            <a href="#"><span className="btn btn-sm btn-danger glyphicon glyphicon-trash"></span></a>
            <a href="#"><span className="btn btn-sm btn-primary glyphicon glyphicon-pencil"></span></a>
          </td>
          <td>{unixTimeToString(data.contents.postDate)}</td>
        </tr>
        )
      }
    }
  }
