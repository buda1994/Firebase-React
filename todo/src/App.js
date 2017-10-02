import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import fire from './fire.js';

// const Button = (props) => {
//   <button  type="submit">X</button>
//   // <button onClick={props.deleteTODO(props.id )} type="submit">X</button>
// }

const CheckBox = (props) =>{


  return(
    <input type="checkBox"/>

  )
  
}

const TODOl = (props) =>{


  return(
    <div style={{margin: '1em'}}>

      

      <form>
      
        {/* <input type="checkBox"/> */}
        {/* <CheckBox /> */}

        {/* {props.todos.map(todos => <CheckBox key={todos.id}{...todos} />)} */}

        <CheckBox todos={this.props} />

        <div style={{display: 'inline-block', marginLeft: 10}}>
          <div style={{fontSize: '1.25m', fontWeight: 'bold'}}>
            {props.text}
            {props.id}
          </div>
         
        </div>
        

        <button type0="button" onClick={() => deleteTODO(props.id)} > X </button>
        

      </form>

    </div>
  );
};

const TODOList = (props) => {

  return (
    <div className="text-center">
      {props.todos.map(todos => <TODOl key={todos.id}  {...todos} />)}
      {/* {props.todos.map(todos => <TODOl key={todos.id}{...todos} />)} */}
    </div>
  );
};

const deleteTODO = (itemId) => {
  console.log(itemId);
  var itemsRef = fire.database().ref('todos');
  itemsRef.child(itemId).remove(function(error) {
    if (error) {
      console.log(error);
    }
  });
}

// const deleteTODO = (itemId) => {
//   console.log(itemId);
//   var itemsRef = fire.database().ref('messages');
//   itemsRef.child(itemId).remove(function(error) {
//     if (error) {
//       console.log(error);
//     }
//   });
// }

class FORM extends React.Component{
  state = { 
    todov: '',
    messages: [],
  }

  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('todos').orderByKey().limitToLast(100);

    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let message = { 
        text: Object.values(snapshot.child('text').val()), 
        status: Object.values(snapshot.child('status').val()),
        id: snapshot.key 
      };

      console.log(message);

      // console.log("-------------------");
      // console.log(snapshot.val());
      // console.log("-------------------");
      // console.log(message);
      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }


  // componentWillMount(){
  //   /* Create reference to messages in Firebase Database */
  //   let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);

  //   messagesRef.on('child_added', snapshot => {
  //     /* Update React state when message is added at Firebase Database */
  //     let message = { text: snapshot.val(), id: snapshot.key };
  //     this.setState({ messages: [message].concat(this.state.messages) });
  //   })
  // }

  saveTODO = (event) => {
    event.preventDefault();
    // fire.database().ref('messages').push( this.state.todov );

    fire.database().ref('todos').push( {
      status: false,
      text: this.state.todov
    });

    this.render();

  }

  render() {
    
    // console.log(this.state.messages);

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">TODOS</h1>
        </header>
        <hr/>

        <form onSubmit={this.saveTODO}>
          <input type="text" 
            value={this.state.userName}
            onChange={(event)=>this.setState({todov: event.target.value})}
            placeholder="Arc" required/>
        </form> 
          
        <TODOList todos={this.state.messages} />

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



// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { messages: [] }; // <- set up react state
//   }
//   componentWillMount(){
//     /* Create reference to messages in Firebase Database */
//     let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
//     messagesRef.on('child_added', snapshot => {
//       /* Update React state when message is added at Firebase Database */
//       let message = { text: snapshot.val(), id: snapshot.key };
//       this.setState({ messages: [message].concat(this.state.messages) });
//     })
//   }
//   addMessage(e){
//     e.preventDefault(); // <- prevent form submit from reloading the page
//     /* Send the message to Firebase */
//     fire.database().ref('messages').push( this.inputEl.value );
//     this.inputEl.value = ''; // <- clear the input
//   }
//   render() {
//     return (
//       <form onSubmit={this.addMessage.bind(this)}>
//         <input type="text" ref={ el => this.inputEl = el }/>
//         <input type="submit"/>
//         <ul>
//           { /* Render the list of messages */
//             this.state.messages.map( message => <li key={message.id}>{message.text}</li> )
//           }
//         </ul>
//       </form>
//     );
//   }
// }

// export default App;
