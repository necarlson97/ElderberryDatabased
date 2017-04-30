import React from 'react';
//import {getUserData} from '../server';

export default class UInotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user:""}
    this.getUserData = this.getUserData.bind(this);
    this.handelNewNote = this.handelNewNote.bind(this);
  }

  getUserData() {
    // Use server methods to get data from the databse
    /*
    getData(4,(userdate)=> {
      do something with the userdata
    })
    */
    this.setState({user:"Hello World"});
  }

  handelNewNote() {
    this.setState({user:"Hello World"});
  }
  render() {
    //console.log(this.state.user);
    return (

      <div classNameName="container-fluid">
        <div className="row" >
          <div className="col-md-10 col-xs-9 background">
            <div className="text-center" >
              <div className="container">
                <div className="row row-height">
                  <div className="col-md-12 boxing">
                    <div className="tabbable-panel-maps">
                      <div className="tabbable-line">

                        <ul className="nav nav-tabs ">
                          <li className="active">
                            <a href="#tab_default_1" data-toggle="tab" onClick={this.handelNewNote}>
                              New Note </a>
                          </li>
                          <li>
                            <a href="#tab_default_2" data-toggle="tab" onClick={this.handelNewNote}>
                              CS326 </a>
                          </li>
                          <li>
                            <a href="#tab_default_3" data-toggle="tab" onClick={this.handelNewNote}>
                              Workshop3 </a>
                          </li>
                        </ul>
                        <div className="tab-content">
                          <div className="tab-pane active" id="tab_default_1">
                            <textarea className="form-control" id="userInput" type="text" value={this.state.user}></textarea>

                          </div>
                          <div className="tab-pane" id="tab_default_2">

                            <textarea className="form-control" id="userInput" type="text" value={this.state.user}></textarea>
                          </div>
                          <div className="tab-pane" id="tab_default_3">
                            <textarea className="form-control" id="userInput" type="text" value={this.state.user}></textarea>


                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    )
  }
}
