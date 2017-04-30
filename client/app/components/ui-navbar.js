import React from 'react';

export default class UInavbar extends React.Component {
  render() {
    return (

      <nav className="navbar navbar-default navbar-fixed-top">


        <a href="#" className="navbar-left"><img className="logoNav" src="/img/jeveesLogo.png"></img></a>



        <div className="col-md-3 col-md-offset-1">
          <div id="custom-search-input">
            <div className="input-group col-md-12">
              <input type="text" className="form-control input" placeholder="Search"></input>
              <span className="input-group-btn">
                <button className="btn btn-info btn-lg" type="button">
                  <i className="glyphicon glyphicon-search search-icon-color"></i>
                </button>
              </span>
            </div>
          </div>
        </div>



        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown"><a href="#" className="dropdown-toggle" data-toggle="dropdown">Welcome, User <b className="caret"></b></a>
          <ul className="dropdown-menu">
            <li><a href="/user/preferences"><i className="glyphicon glyphicon-cog"></i> Preferences</a></li>
            <li><a href="/help/support"><i className="glyphicon glyphicon-envelope"></i> Contact Support</a></li>
            <li className="divider"></li>
            <li><a href="/auth/logout"><i className="glyphicon glyphicon-off"></i> Logout</a></li>
          </ul>
        </li>

        
      </ul>
    </nav>

  )
}
}
