import React, { Component } from 'react';
import './App.css';
import fire from './fire.js';

// const Button = (props) => {
//   <button  type="submit">X</button>
//   // <button onClick={props.deleteTODO(props.id )} type="submit">X</button>
// }

// state = { 
//   // todov: '',
//   messages: []
// }

const CheckBox = (props) =>{
  return(
    <input type="checkBox"/>
  )
}

const TODOl = (props) =>{
  console.log(props);
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
            {/* {props.id} */}
          </div>
         
        </div>
        

        <button type0="button" onChange={(event)=>this.setState(this.state)} onClick={(evt) => deleteTODO(props.id, evt)} > X </button>
        {/* <button type0="button" onClick={() => deleteTODO(props.id)} > X </button> */}

        {/* <button 
          onChange={(event)=>this.setState({itemId: props.id})}
          onClick={this.deleteTODO}>X
        </button> */}


        {/* <form onSubmit={this.saveTODO}>
          <input type="text" 
            value={this.state.userName}
            onChange={(event)=>this.setState({todov: event.target.value})}
            placeholder="Arc" required/>
        </form>  */}

      </form>
    </div>
  );
};

const TODOList = (props) => {
  // console.log(props);
  return (
    <div className="text-center">
      {props.todos.map(todos => <TODOl key={todos.id}  {...todos} />)}
      {/* {props.todos.map(todos => <TODOl key={todos.id}{...todos} />)} */}
    </div>
  );
};


// saveTODO = (event) => {
//   event.preventDefault();
//   // fire.database().ref('messages').push( this.state.todov );

//   fire.database().ref('todos').push( {
//     status: false,
//     text: this.state.todov
//   });

//   // this.render();

// }


const deleteTODO = (itemId, event) => {

  event.preventDefault();
  
  // console.log(itemId);
  var itemsRef = fire.database().ref('todos');
  itemsRef.child(itemId).remove(function(error) {
    if (error) {
      console.log(error);
    }
  });
}


const arc = () =>{
  
}

// const deleteTODO = (itemId) => {
//   event.preventDefault();
//   console.log(itemId);
//   var itemsRef = fire.database().ref('todos');
//   itemsRef.child(itemId).remove(function(error) {
//     if (error) {
//       console.log(error);
//     }
//   });
// }

class FORM extends React.Component{
  state = { 
    todov: '',
    // messages: [],
  }

  // componentWillMount(){
  //   /* Create reference to messages in Firebase Database */
  //   let messagesRef = fire.database().ref('todos').orderByKey().limitToLast(100);

  //   messagesRef.on('child_added', snapshot => {
  //     /* Update React state when message is added at Firebase Database */
  //     let message = { 
  //       text: Object.values(snapshot.child('text').val()), 
  //       status: Object.values(snapshot.child('status').val()),
  //       id: snapshot.key 
  //     };

  //     // var itemsRef = fire.database().ref('todos');
  //     // itemsRef.child(itemId).remove(function(error) {
  //     //   if (error) {
  //     //     console.log(error);
  //     //   }
  //     // });

  //     // console.log("-------------------------------------------");
  //     // text: Object.values(snapshot.child('text').val()), 
  //     // console.log("-------------------------------------------");
  //     // console.log(message);

  //     // console.log("-------------------");
  //     // console.log(snapshot.val());
  //     // console.log("-------------------");
  //     // console.log(message);
  //     this.setState({ messages: [message].concat(this.state.messages) });
  //   })
  // }


  // componentWillMount(){
  //   /* Create reference to messages in Firebase Database */
  //   let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);

  //   messagesRef.on('child_added', snapshot => {
  //     /* Update React state when message is added at Firebase Database */
  //     let message = { text: snapshot.val(), id: snapshot.key };
  //     this.setState({ messages: [message].concat(this.state.messages) });
  //   })
  // }

  // deleteTODO = (itemId, event) => {
    
  //   event.preventDefault();
      
  //   // console.log(itemId);
  //   var itemsRef = fire.database().ref('todos');
  //   itemsRef.child(itemId).remove(function(error) {
  //     if (error) {
  //       console.log(error);
  //     }
  //   });
  // }

  saveTODO = (event) => {
    event.preventDefault();
    // fire.database().ref('messages').push( this.state.todov );

    fire.database().ref('todos').push( {
      status: false,
      text: this.state.todov
    });

    
    // this.render();

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
            value={this.state.userName}
            onChange={(event)=>this.setState({todov: event.target.value})}
            placeholder="Arc" required/>
        </form> 
          
        {/* <TODOList todos={this.state.messages} /> */}

      </div>
    );
  }

}

class App extends React.Component {
  state = { 
    // todov: '',
    messages: []
  }

////////////////////////////////////////////

  deleteTODO = (itemId, event) => {
    
    event.preventDefault();
      
      // console.log(itemId);
    var itemsRef = fire.database().ref('todos');
    itemsRef.child(itemId).remove(function(error) {
      if (error) {
        console.log(error);
      }
    });
  }

////////////////////////////////////////////

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

      // var itemsRef = fire.database().ref('todos');
      // itemsRef.child(itemId).remove(function(error) {
      //   if (error) {
      //     console.log(error);
      //   }
      // });

      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }

  render() {
    return (
      <div>
        <FORM />
        <TODOList todos={this.state.messages} />
      </div>
    );
  }
}

export default App;

