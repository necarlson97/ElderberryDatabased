import React from 'react';
import {unixTimeToString} from './util.js';

export default class Files extends React.Component{
  constructor(props) {
    super(props);
    this.state = props.data;
  }

  render(){
    var data = this.state;
      return(
        <tbody>
        <tr>
          <td><a href="#">{data.title}</a></td>
          <td>{unixTimeToString(data.contents.postDate)}</td>
          <td>{data.type}</td>
        </tr>
        </tbody>
    )
    }
}
