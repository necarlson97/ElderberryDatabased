import React from 'react';
import SimpleMap from './simple-map.js';


export default class UImaps extends React.Component {
  render() {
    //console.log('here maps')
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

                          <h2>Maps</h2>
                          <SimpleMap />


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
