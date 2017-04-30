import React from 'react';
import {getMasterFolderData} from '../server.js';
import Trash from './trash.js';

export default class UIfileEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contents: []
    };
  }

  refresh() {
    getMasterFolderData(4, (Data) => {
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
                        <h2>Trash</h2>
                        <div className= "col-md-12 row">
                          <div className="container-fluid adm-archivos">

                            <div className="col-md-12">
                              <div className="panel panel-default">
                                <div className="panel-heading text-center">
                                  <span><strong><span className="glyphicon glyphicon-folder-open"> </span> Files</strong></span>
                                </div>
                                <table className="table table-bordered table-hover vmiddle">
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th>File Name</th>
                                      <th>Actions</th>
                                      <th>Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.contents.map((Data) => {
                                      return(
                                        <Trash key={Data.idx} data={Data} fileDelete={(idx, author) => this.fileDelete(idx, author)}/>
                                      )
                                    })}
                                  </tbody>
                                </table>
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
        </div>
      </div>

    )
  }
}
