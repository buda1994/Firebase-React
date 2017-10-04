import React, { Component } from 'react';
import './App.css';
import fire from './fire.js';


class FORM extends React.Component{
  state = { 
    todov: '',
    messages: [],
    stat: ""
  }
  
  TODOl = (props) =>{

    if(props.render==="true"){

      this.state.count = Number(this.state.count) + 1;
      // console.log("count: ",this.state.count);
      // console.log("stat: ",this.state.stat);

      return(
        <div style={{margin: '1em'}}>
          <form>

            <this.CheckBox todos={props} />
    
            <div style={{display: 'inline-block', marginLeft: 10}}>
              <div style={{fontSize: '1.25m', fontWeight: 'bold'}}>
                {props.text}
              </div>
            </div>
            
            <button className="buttonX" onClick={(event) => this.deleteTODO(props, event)} > X </button>
            
          </form>
        </div>
      );

    }
    else if(props.render==="false"){
      // console.log("render false");
      return(
        <div style={{margin: '1em'}}>
              
        </div>
      );
    }

  };
  
  TODOList = (props) => {
    return (
      <div className="text-center">
        {props.todos.map(todos => <this.TODOl key={todos.id} {...todos} />)}
      </div>
    );
  };

  CheckBox = (props) =>{

    if(props.todos.status==="false"){
      return(
        <input className="ChackboxA" onClick={(event) => this.modifyTODO(props, event)} type="checkBox" />
      )
    }
    
    if(props.todos.status==="true"){
      return(
        <input className="ChackboxA" onClick={(event) => this.modifyTODO(props, event)} type="checkBox" defaultChecked/>
      )
    } 

  }

  BottomBar = (props) =>{

    var count=0;

    for(var i=0;i<props.todos.length;i++){
      if(props.todos[i].status==="false"){
        count++;
      }
    }

    if(props.todos.length===0){

      return(
        <div style={{margin: '1em'}}>
              
        </div>
      );
    
    }
    else{

      return(
        <div style={{margin: '1em'}}>
          <form>
            <span>{count} items left</span>
            <button onClick={(event) => this.selectTODO(props, "All", event)} > All </button>
            <button onClick={(event) => this.selectTODO(props, "Act", event)} > Active </button>
            <button onClick={(event) => this.selectTODO(props, "Com", event)} > Completed </button>
            <button onClick={(event) => this.selectTODO(props, "Clc", event)} > Clear Completed </button>
          </form>
        </div>
      );
    
    }
  };

  selectTODO = (props, act, event) => {
    event.preventDefault();

    var itemsRef = fire.database().ref('todos');
    var arraym = this.state.messages;
    // console.log(props.todos);
    // console.log("sdasd ",props.todos[1].text);

    if(act==="All"){
      // console.log("All")

      for(var i=0;i<this.state.messages.length;i++){
        itemsRef.child(this.state.messages[i].id).update({
          status: props.todos[i].status,
          text: props.todos[i].text,
          render: "true"
        } );
      }

      for(i=0;i<this.state.messages.length;i++){
        arraym[i].render="true";
        this.setState({messages: arraym });
      }

      // console.log(props.todos);
      this.state.stat = "All";

    }
    else if(act==="Act"){
      // console.log("Act")

      this.rendersTODO(props, "true","false");
      this.state.stat = "Act";

    }
    else if(act==="Com"){
      // console.log("Com")

      this.rendersTODO(props, "false","true");
      this.state.stat = "Com";
    }
    else if(act==="Clc"){
      // console.log("Clc")

      var array = this.state.messages;
      
      for(i=0;i<this.state.messages.length;i++){
        console.log(this.state.messages.length);
        if(this.state.messages[i].status==="true")
        {
          itemsRef.child(this.state.messages[i].id).remove(function(error) {
            if (error) {
              console.log(error);
            }
          });
        }
      }

      for(i=this.state.messages.length-1;i>= 0;i--){
        if(this.state.messages[i].status==="true"){
          array.splice(i, 1);
          console.log("Azeroth");
        }

      }

      this.setState({messages: array });

    }
  }

  deleteTODO = (itemId, event) => {
    event.preventDefault();

    var itemsRef = fire.database().ref('todos');
    itemsRef.child(itemId.id).remove(function(error) {
      if (error) {
        console.log(error);
      }
    });

    var array = this.state.messages;
    for(var i=0;i<this.state.messages.length;i++){
      if(this.state.messages[i].id===itemId.id){
        array.splice(i, 1);
        this.setState({messages: array });
      }
    }

  }

  rendersTODO = (props, rtrue, rfalse)=>{

    var itemsRef = fire.database().ref('todos');
    var arraym = this.state.messages;


    ////  rtrue=true,    rfalse=false
    for(var i=0;i<this.state.messages.length;i++){
      
      if(this.state.messages[i].status==="true")
      {
        itemsRef.child(this.state.messages[i].id).update({
          status: props.todos[i].status,
          text: props.todos[i].text,
          render: rfalse
        } );
      }

      else if(this.state.messages[i].status==="false")
      {
        itemsRef.child(this.state.messages[i].id).update({
          status: props.todos[i].status,
          text: props.todos[i].text,
          render: rtrue
        } );
      }

    }

    for(i=0;i<this.state.messages.length;i++){

      if(this.state.messages[i].status==="true")
      {
        arraym[i].render=rfalse;
        this.setState({messages: arraym });
      }
      if(this.state.messages[i].status==="false")
      {
        arraym[i].render=rtrue;
        this.setState({messages: arraym });
      }
    }

  }

  modifyTODO = (props, event) =>{
    
    var status;

    if (props.todos.status==="false"){
      status="true";
    }
    else if (props.todos.status==="true"){
      status="false";
    }

    var itemsRef = fire.database().ref('todos');

    itemsRef.child(props.todos.id).update({
      status: status,
      text: props.todos.text
    } );

    var arraym = this.state.messages;
    for(var i=0;i<this.state.messages.length;i++){
      if(this.state.messages[i].id===props.todos.id){
        arraym[i].status=status;
        this.setState({messages: arraym });
      }
    }
    
  }

  

  saveTODO = (event) => {
    event.preventDefault();

    var arc5=""
    if(this.state.stat==="Com"){
      arc5="false";
    }
    else{
      arc5="true";
    }

    fire.database().ref('todos').push( {
      status: "false",
      text: this.state.todov,
      render: arc5,
    });

  }

  componentWillMount(){
    let messagesRef = fire.database().ref('todos').orderByKey().limitToLast(100);
    
    messagesRef.on('child_added', snapshot => {

      var arc1 = Object.values(snapshot.child('status').val());
      var arc2 = Object.values(snapshot.child('text').val());
      var arc3 = Object.values(snapshot.child('render').val());
      
      var textS = arc1.join().split(',').join('')
      var textT = arc2.join().split(',').join('')
      var textR = arc3.join().split(',').join('')

      let message = { 
        text: textT,
        status: textS,
        render: textR,
        id: snapshot.key 
      };

      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">TODOS</h1>
        </header>
        <hr/>

        <form onSubmit={this.saveTODO}>
          <input type="text" 
            onChange={(event)=>this.setState({todov: event.target.value})}
            placeholder="Arc" 
            id="txtb" required/>
        </form> 
        
        <this.TODOList todos={this.state.messages} />
        <this.BottomBar todos={this.state.messages}/>

      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <FORM />
        {/* <TODOList todos={this.state.messages} /> */}
      </div>
    );
  }
}

export default App;

