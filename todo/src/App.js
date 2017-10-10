import React, { Component } from 'react';
import './App.css';
import fire from './fire.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import DoneAll from 'material-ui/svg-icons/action/done-all';
import Done from 'material-ui/svg-icons/action/done';
import TextField from 'material-ui/TextField';
import Delete from 'material-ui/svg-icons/action/delete';
import AppBar from 'material-ui/AppBar';
import Active from 'material-ui/svg-icons/image/crop-square';
import firebase from 'firebase'
import Avatar from 'material-ui/Avatar';

class ToDoReact extends Component {
  state = {
    newTodo: "",
    editTodo: "",
    todos: [],
    event: "All",
    editingID: "",
    user: ""
  }

  AddBox = () => {
    if (this.state.user) {
      return (
        <MuiThemeProvider>
          <form onSubmit={this.saveItem}>
            <this.CheckAll todos={this.state.todos} />
            <TextField style={{ marginBottom: "40px", marginTop: "30px" }} value={this.state.newTodo} onChange={(event) => this.setState({ newTodo: event.target.value })} hintText="What needs to be done?" />
          </form>
        </MuiThemeProvider>
      );
    }
    return null;
  }

  Header = () => {
    var icon = null
    var title = "TODO List"
    var elementRight = <FlatButton label="Sign-In" onClick={(event) => this.login(event)} />;

    if (this.state.user) {
      icon = <Avatar src={this.state.user.photoURL} />
      title = this.state.user.displayName;
      elementRight = <FlatButton label="Sign-Out" onClick={(event) => this.logout(event)} />;
    }

    return (
      <MuiThemeProvider>
        <AppBar
          style={{ backgroundColor: "black" }}
          iconElementLeft={icon}
          title={title}
          iconElementRight={elementRight}
        />
      </MuiThemeProvider>
    );
  }

  TodoList = (props) => {
    if (this.state.user) {
      return (
        <div className="text-center">
          {props.todos.map(todos => <this.TodoElement key={todos.id} {...todos} />)}
        </div>
      );
    }

    return null;
  };

  TodoElement = (props) => {
    if (this.state.editingID === props.id) {
      if (this.state.event === "All" || (this.state.event === "Act" && props.status === "false") || (this.state.event === "Com" && props.status === "true")) {
        return (
          <div>
            <form onSubmit={(event) => this.editItem(props, event)} >
              <MuiThemeProvider>
                <TextField onChange={(event) => this.setState({ editTodo: event.target.value })} hintText={props.text} />
              </MuiThemeProvider>
            </form>
          </div>
        );
      }
    }

    if (this.state.event === "All" || (this.state.event === "Act" && props.status === "false") || (this.state.event === "Com" && props.status === "true")) {
      return (
        <div >
          <div style={{ display: 'inline-block', width: "25%" }}>
            <this.CheckBox todos={props} />
          </div>
          <div style={{ display: 'inline-block', width: "50%" }}>
            <p onDoubleClick={() => this.setState({ editingID: props.id })} > {props.text} </p>
          </div>
          <div style={{ display: 'inline-block', width: "25%" }}>
            <MuiThemeProvider>
              <FlatButton icon={<Delete />} onClick={(event) => this.deleteItem(props, event)} />
            </MuiThemeProvider>
          </div>
        </div>
      );
    }

    return null;
  };

  CheckAll = (props) => {
    var count = 0;
    var statusCheck = "true"

    for (var i = 0; i < props.todos.length; i++) {
      if (props.todos[i].status === "true") {
        count++;
      }
    }

    if (count === props.todos.length && count > 0) {
      statusCheck = "false";
    }

    return (
      <MuiThemeProvider>
        <FlatButton icon={<DoneAll />} onClick={() => this.markAll(props, statusCheck)} />
      </MuiThemeProvider>
    );

  };

  BottomBar = (props) => {
    var count = 0;

    for (var i = 0; i < props.todos.length; i++) {
      if (props.todos[i].status === "false") {
        count++;
      }
    }

    if (props.todos.length !== 0) {
      return (
        <div style={{ margin: '1em', marginTop: '45px' }}>
          <MuiThemeProvider>
            <Toolbar style={{ backgroundColor: "black" }}>
              <ToolbarGroup>
                <span style={{ color: "white" }}>{count} items left</span>
              </ToolbarGroup>
              <ToolbarGroup>
                <FlatButton style={{ backgroundColor: "black", color: "white" }} label="All" onClick={(event) => this.selectItems(props, "All", event)} />
                <FlatButton style={{ backgroundColor: "black", color: "white" }} label="Active" onClick={(event) => this.selectItems(props, "Act", event)} />
                <FlatButton style={{ backgroundColor: "black", color: "white" }} label="Completed" onClick={(event) => this.selectItems(props, "Com", event)} />
                <FlatButton style={{ backgroundColor: "black", color: "white" }} label="Clear Completed" onClick={(event) => this.deleteCompleted(event)} />
              </ToolbarGroup>
            </Toolbar>
          </MuiThemeProvider>
        </div>
      );
    }

    return null;
  };

  CheckBox = (props) => {
    var icon = props.todos.status === "true" ? <Done /> : <Active />;

    return (
      <MuiThemeProvider>
        <FlatButton icon={icon} onClick={(event) => this.modifyItem(props, event)} />
      </MuiThemeProvider>
    );
  }

  selectItems = (props, act, event) => {
    event.preventDefault();
    this.setState({ event: act });
  }

  deleteCompleted = (event) => {
    event.preventDefault();
    var itemsRef = fire.database().ref('todos');
    var todosTempState = this.state.todos;

    for (var i = 0; i < this.state.todos.length; i++) {
      if (this.state.todos[i].status === "true") {
        itemsRef.child(this.state.todos[i].id).remove(function (error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }

    for (i = this.state.todos.length - 1; i >= 0; i--) {
      if (this.state.todos[i].status === "true") {
        todosTempState.splice(i, 1);
      }
    }

    this.setState({ todos: todosTempState });
  }

  markAll = (props, statusMark) => {
    var itemsRef = fire.database().ref('todos');
    var todosTempState = this.state.todos;

    for (var i = 0; i < this.state.todos.length; i++) {
      itemsRef.child(this.state.todos[i].id).update({
        status: statusMark.toString(),
        text: props.todos[i].text,
      });
    }

    for (i = 0; i < this.state.todos.length; i++) {
      todosTempState[i].status = statusMark.toString();
    }

    this.setState({ todos: todosTempState });
  }

  login = (event) => {
    event.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  logout = (event) => {
    event.preventDefault();
    firebase.auth().signOut();
    this.setState({ todos: [] })
  }

  modifyItem = (props, event) => {
    event.preventDefault();
    var itemsRef = fire.database().ref('todos');
    var status = props.todos.status === "false" ? "true" : 'false';
    var todosTempState = this.state.todos;

    itemsRef.child(props.todos.id).update({
      status: status,
      text: props.todos.text,
    });

    for (var i = 0; i < this.state.todos.length; i++) {
      if (this.state.todos[i].id === props.todos.id) {
        todosTempState[i].status = status;
        todosTempState[i].text = props.todos.text;
        this.setState({ todos: todosTempState });
      }
    }
  }

  editItem = (props, event) => {
    event.preventDefault();
    var textTemp = this.state.editTodo === "" ? props.text : this.state.editTodo;
    var itemsRef = fire.database().ref('todos');
    var todosTempState = this.state.todos;

    itemsRef.child(props.id).update({
      status: props.status,
      text: textTemp,
    });

    for (var i = 0; i < this.state.todos.length; i++) {
      if (this.state.todos[i].id === props.id) {
        todosTempState[i].text = textTemp;
        this.setState({ todos: todosTempState, editingID: "", editTodo: "" });
      }
    }
  }

  deleteItem = (itemId, event) => {
    event.preventDefault();

    var itemsRef = fire.database().ref('todos');
    itemsRef.child(itemId.id).remove(function (error) {
      if (error) {
        console.log(error);
      }
    });

    var tempState = this.state.todos;
    for (var i = 0; i < this.state.todos.length; i++) {
      if (this.state.todos[i].id === itemId.id) {
        tempState.splice(i, 1);
        this.setState({ todos: tempState });
      }
    }
  }

  saveItem = (event) => {
    event.preventDefault();

    fire.database().ref('todos').push({
      status: "false",
      text: this.state.newTodo
    });

    this.setState({ newTodo: "" });
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user })

        let messagesRef = fire.database().ref('todos').orderByKey().limitToLast(100);

        messagesRef.on('child_added', snapshot => {
          var statusDB = Object.values(snapshot.child('status').val());
          var textDB = Object.values(snapshot.child('text').val());

          var textStatus = statusDB.join().split(',').join('')
          var textText = textDB.join().split(',').join('')

          let todosTempState = {
            text: textText,
            status: textStatus,
            id: snapshot.key
          };

          this.setState({ todos: [todosTempState].concat(this.state.todos) });
        })
      }
      else {
        this.setState({ user: null })
      }
    })
  }

  render() {
    return (
      <div className="App">
        <this.Header />
        <this.AddBox />
        <this.TodoList todos={this.state.todos} />
        <this.BottomBar todos={this.state.todos} />
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <ToDoReact />
      </div>
    );
  }
}

export default App;

