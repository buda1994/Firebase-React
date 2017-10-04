import React, { Component } from 'react';
import './App.css';
import fire from './fire.js';


class FORM extends React.Component{
  state = { 
    todov: '',
    messages: [],
  }

  BottomBar = (props) =>{

    console.log(props.todos);
    
    return(
      // <input type="checkBox"/>
      <div style={{margin: '1em'}}>
        <form>
          {/* <h2>Text</h2> */}
          <button > X </button>
          <button > R </button>
          <button > X </button>
        </form>
      </div>
    );

  };

  
  TODOl = (props) =>{
    return(
      <div style={{margin: '1em'}}>
        <form>

          <this.CheckBox todos={props} />
  
          <div style={{display: 'inline-block', marginLeft: 10}}>
            <div style={{fontSize: '1.25m', fontWeight: 'bold'}}>
              {props.text}
            </div>
          </div>
          
          <button className="buttonX" onClick={(event) => this.deleteTODO( props , event)} > X </button>
          
        </form>
      </div>
    );
  };
  
  TODOList = (props) => {
    return (
      <div className="text-center">
        {props.todos.map(todos => <this.TODOl key={todos.id} {...todos} />)}
      </div>
    );
  };


  CheckBox = (props) =>{
    
    var status;

    if(props.todos.status.constructor === Array){
      status = props.todos.status.join().split(',').join('')
    }
    else{
      status = props.todos.status
    }
    
    if(status==="false"){
      return(
        <input className="ChackboxA" onClick={(event) => this.modifyTODO(props, status, event)} type="checkBox" />
      )
    }
    
    if(status==="true"){
      return(
        <input className="ChackboxA" onClick={(event) => this.modifyTODO(props, status, event)} type="checkBox" defaultChecked/>
      )
    } 
  }


  modifyTODO = (props, status, event) =>{
    
    if (status==="false"){
      status="true";
    }
    else if (status==="true"){
      status="false";
    }

    var itemsRef = fire.database().ref('todos');
    var textA = props.todos.text.join().split(',').join('')

    itemsRef.child(props.todos.id).update({
      status: status,
      text: textA
    } );

    var arraym = this.state.messages;
    for(var i=0;i<this.state.messages.length;i++){
      if(this.state.messages[i].id===props.todos.id){
        arraym[i].status=status;
        this.setState({messages: arraym });
      }
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

  saveTODO = (event) => {
    event.preventDefault();

    fire.database().ref('todos').push( {
      status: "false",
      text: this.state.todov
    });

  }

  componentWillMount(){
    let messagesRef = fire.database().ref('todos').orderByKey().limitToLast(100);
    
    messagesRef.on('child_added', snapshot => {
      let message = { 
        text: Object.values(snapshot.child('text').val()), 
        status: Object.values(snapshot.child('status').val()),
        id: snapshot.key 
      };

      this.setState({ messages: [message].concat(this.state.messages) });
    })
    // this.arc();
        
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
        {/* <this.BottomBar todos={this.state.messages}/> */}

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

