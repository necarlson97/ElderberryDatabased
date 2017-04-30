import React from 'react';

export default class Files extends React.Component{
  constructor(props) {
    super(props);
    this.state = props.data;
  }

  render(){
    var data = this.state;
    if(data.type == "file"){
      return(
      <div className="row col-md-12">
         <div className= "pull-left">
         <a href = '#'><span className="glyphicon glyphicon-list-alt glyphicon-larger"></span>
         <font size = "+2">{data.title}</font></a>
         </div>
      </div>
    )
    }
    if(data.type == "picture"){
      return(
      <div className="row col-md-12">
         <div className= "pull-left">
             <a href = '#'><span className="glyphicon glyphicon-picture glyphicon-larger"></span>
                 <font size = "+2">{data.title}</font></a>
         </div>
       </div>
     )
    }
    if(data.type == "folder"){
      return(
      <div className="row col-md-12">
         <div className= "pull-left">
             <button type="button" className="btn btn-default">
             <span className="glyphicon glyphicon-folder-close glyphicon-larger"></span>
                 <font size = "+2">{data.title}</font>
             </button>
         </div>
         {this.state.contents.map((Data) => {
             return(
               <Files key={Data.idx} data={Data} />
               )
       })}
      </div>
    )
    }
  }
}
