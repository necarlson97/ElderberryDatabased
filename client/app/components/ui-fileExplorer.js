import React from 'react';

import Files from './files.js'
import {getData} from '../server.js';

export default class UIfileExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: []
    };
  }

  refresh() {
    getData(4 , (Data) => {
      this.setState(Data);
    });
  }

  componentDidMount() {
    this.refresh();
  }

  render() {
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
                        <h2>Files</h2>
                        <div className="contentBox">

                          <div className= "col-md-12">
                            {this.state.contents.map((Data) => {
                              return(
                                <Files key={Data.idx} data={Data} />
                              )
                            })}
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
