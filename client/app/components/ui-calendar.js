import React from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

BigCalendar.momentLocalizer(moment)
require('style!css!react-big-calendar/lib/css/react-big-calendar.css')

export default class UIcalendar extends React.Component {
      render () {
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

                                          <h2>Calendar</h2>
                                          <div className="tab-content">
                                              <div className= "row">
                                                <div className= "col-md-12">
                                                <BigCalendar style={{height: '320px'}} events={[]} />
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
