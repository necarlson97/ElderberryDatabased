import React from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

BigCalendar.momentLocalizer(moment)
require('style!css!react-big-calendar/lib/css/react-big-calendar.css')

var events = [
  {
    'title': 'With Grandma All Day',
    'allDay': true,
    'start': new Date(2017, 4, 0),
    'end': new Date(2017, 4, 1)
  },
  {
    'title': 'Long Weekend, visit home',
    'start': new Date(2017, 4, 7),
    'end': new Date(2017, 4, 10)
  },

  {
    'title': 'Visit Kennel',
    'start': new Date(2017, 4, 2, 9, 0, 0),
    'end': new Date(2017, 4, 2, 10, 0, 0)
  },
  {
    'title': 'CS Conference',
    'start': new Date(2017, 4, 11, 11, 0, 0),
    'end': new Date(2017, 4, 13),
    desc: 'Big conference for important people'
  },
  {
    'title': 'Meeting',
    'start': new Date(2017, 4, 12, 10, 30, 0, 0),
    'end': new Date(2017, 4, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting'
  },
  {
    'title': 'Lunch',
    'start':new Date(2017, 4, 12, 12, 0, 0, 0),
    'end': new Date(2017, 4, 12, 13, 0, 0, 0),
    desc: 'Power lunch'
  },
  {
    'title': 'Meeting',
    'start':new Date(2017, 4, 12,14, 0, 0, 0),
    'end': new Date(2017, 4, 12,15, 0, 0, 0)
  },
  {
    'title': 'Happy Hour',
    'start':new Date(2017, 4, 12, 17, 0, 0, 0),
    'end': new Date(2017, 4, 12, 17, 30, 0, 0),
    desc: 'Most important meal of the day'
  },
  {
    'title': 'Dinner',
    'start':new Date(2017, 4, 12, 20, 0, 0, 0),
    'end': new Date(2017, 4, 12, 21, 0, 0, 0)
  },
  {
    'title': 'Craig\'s Birthday Party',
    'start':new Date(2017, 4, 13, 7, 0, 0),
    'end': new Date(2017, 4, 13, 10, 30, 0)
  }
];

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
                              <BigCalendar style={{height: '320px'}} events={events} />
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
