import React, { Component } from 'react';
import './App.css';
import fire from './fire.js';



// const BottomBar = (props) =>{
//   return(
//     // <input type="checkBox"/>
//     <div style={{margin: '1em'}}>
//       <form>
//         {/* <h2>Text</h2> */}
//         <button > X </button>
//         <button > X </button>
//         <button > X </button>
//       </form>
//     </div>
//   );
// };

class FORM extends React.Component{
  state = { 
    todov: '',
    messages: [],
  }

  CheckBox = (props) =>{
    return(
      <input type="checkBox"/>
    )
  }

  TODOl = (props) =>{
    // console.log(props);
    return(
      <div style={{margin: '1em'}}>
  
        <form>
  
          {/* {props.todos.map(todos => <CheckBox key={todos.id}{...todos} />)} */}
          <this.CheckBox todos={this.props} />
  
          {/* <this.Checkbox todos={this.state.messages} /> */}

          <div style={{display: 'inline-block', marginLeft: 10}}>
            <div style={{fontSize: '1.25m', fontWeight: 'bold'}}>
              {props.text}
            </div>
          </div>
          
          <button onClick={(event) => this.deleteTODO( props , event)} > X </button>
          {/* <button onClick={(event) => this.deleteTODO(props.id, event)} > X </button> */}
          
        </form>
      </div>
    );
  };
  
  TODOList = (props) => {
    // console.log(props);
    return (
      <div className="text-center">
        {/* {props.todos.map(todos => <this.TODOl key={todos} {...todos} />)} */}
        {props.todos.map(todos => <this.TODOl key={todos.id} {...todos} />)}
      </div>
    );
  };

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
      status: false,
      text: this.state.todov
    });

  }

  componentWillMount(){
    let messagesRef = fire.database().ref('todos').orderByKey().limitToLast(100);
    
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let message = { 
        text: Object.values(snapshot.child('text').val()), 
        status: Object.values(snapshot.child('status').val()),
        id: snapshot.key 
      };
    
      // var itemsRef = fire.database().ref('todos');
      // itemsRef.child(itemId).remove(function(error) {
      //   if (error) {
      //     console.log(error);
      //   }
      // });
    
      console.log("hdfhd");

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
            placeholder="Arc" required/>
        </form> 
          
        <this.TODOList todos={this.state.messages} />
        {/* <BottomBar /> */}

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

