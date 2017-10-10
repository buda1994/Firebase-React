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
    newTodo: '',
    todos: [],
    stat: "All",
    editing: "",
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
    if (this.state.editing === props.id) {
      if (props.render === "true") {
        return (
          <div>
            <form onSubmit={(event) => this.editItem(props, event)} >
              <MuiThemeProvider>
                <TextField onChange={(event) => this.setState({ newTodo: event.target.value })} hintText={props.text} />
              </MuiThemeProvider>
            </form>
          </div>
        );
      }
    }

    if (props.render === "true") {
      return (
        <div >
          <div style={{ display: 'inline-block', width: "25%" }}>
            <this.CheckBox todos={props} />
          </div>
          <div style={{ display: 'inline-block', width: "50%" }}>
            <p onDoubleClick={() => this.setState({ editing: props.id })} > {props.text} </p>
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
          {/* <div> */}
          <MuiThemeProvider>
            <Toolbar style={{ backgroundColor: "black" }}>
              <ToolbarGroup>
                <span style={{ color: "white" }}>{count} items left</span>
              </ToolbarGroup>
              <ToolbarGroup>
                <FlatButton style={{ backgroundColor: "black", color: "white" }} label="All" onClick={(event) => this.selectItems(props, "All", event)} />
                <FlatButton style={{ backgroundColor: "black", color: "white" }} label="Active" onClick={(event) => this.selectItems(props, "Act", event)} />
                <FlatButton style={{ backgroundColor: "black", color: "white" }} label="Completed" onClick={(event) => this.selectItems(props, "Com", event)} />
                <FlatButton style={{ backgroundColor: "black", color: "white" }} label="Clear Completed" onClick={(event) => this.selectItems(props, "Clc", event)} />
              </ToolbarGroup>
            </Toolbar>
          </MuiThemeProvider>
        </div>
      );
    }

    return null;
  };

  CheckBox = (props) => {
    var icon = ""
    icon = props.todos.status === "true" ? <Done /> : <Active />;

    return (
      <MuiThemeProvider>
        <FlatButton icon={icon} onClick={(event) => this.modifyItem(props, event)} />
      </MuiThemeProvider>
    );
  }

  CheckAll = (props) => {
    var count = 0;
    var statusTemp = "true"

    for (var i = 0; i < props.todos.length; i++) {
      if (props.todos[i].status === "true") {
        count++;
      }
    }

    if (count === props.todos.length && count > 0) {
      statusTemp = "false";
    }

    return (
      <MuiThemeProvider>
        <FlatButton icon={<DoneAll />} onClick={() => this.markAll(props, statusTemp)} />
      </MuiThemeProvider>
    );

  };

  markAll = (props, statusMark) => {
    var itemsRef = fire.database().ref('todos');
    var arrayTemp = this.state.todos;

    for (var i = 0; i < this.state.todos.length; i++) {
      itemsRef.child(this.state.todos[i].id).update({
        status: statusMark.toString(),
        text: props.todos[i].text,
        render: props.todos[i].render
      });
    }

    for (i = 0; i < this.state.todos.length; i++) {
      arrayTemp[i].status = statusMark.toString();
    }

    this.setState({ todos: arrayTemp });
    this.changeRenderDB(props, this.state.stat.statt);
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
    var renderStatus;
    var itemsRef = fire.database().ref('todos');
    var status = props.todos.status === "false" ? "true" : 'false';

    if (this.state.stat.statt === "All") {
      renderStatus = "true"
    }
    else if (this.state.stat.statt === "Act" && status === "false") {
      renderStatus = "true"
    }
    else if (this.state.stat.statt === "Act" && status === "true") {
      renderStatus = "false"
    }
    else if (this.state.stat.statt === "Com" && status === "false") {
      renderStatus = "false"
    }
    else if (this.state.stat.statt === "Com" && status === "true") {
      renderStatus = "true"
    }

    itemsRef.child(props.todos.id).update({
      status: status,
      text: props.todos.text,
      render: renderStatus
    });

    var arrayTemp = this.state.todos;
    for (var i = 0; i < this.state.todos.length; i++) {
      if (this.state.todos[i].id === props.todos.id) {
        arrayTemp[i].status = status;
        arrayTemp[i].render = renderStatus;
        arrayTemp[i].text = props.todos.text;
        this.setState({ todos: arrayTemp });
      }
    }
  }

  editItem = (props, event) => {
    event.preventDefault();
    var textTemp = this.state.newTodo === "" ? props.text : this.state.newTodo;
    var itemsRef = fire.database().ref('todos');

    itemsRef.child(props.id).update({
      status: props.status,
      text: textTemp,
      render: props.render
    });

    var arrayTemp = this.state.todos;
    for (var i = 0; i < this.state.todos.length; i++) {
      if (this.state.todos[i].id === props.id) {
        arrayTemp[i].text = textTemp;
        this.setState({ todos: arrayTemp, editing: " ", newTodo: "" });
      }
    }
  }

  changeRenderDB = (props, act) => {
    var itemsRef = fire.database().ref('todos');
    var itemsRef2 = fire.database().ref('stat');
    var arrayTemp = this.state.todos;
    let statTemp;

    if (act === "All") {
      for (var i = 0; i < this.state.todos.length; i++) {
        itemsRef.child(this.state.todos[i].id).update({
          status: props.todos[i].status,
          text: props.todos[i].text,
          render: "true"
        });
      }

      statTemp = {
        statt: "All",
        id: this.state.stat.id
      };

      for (i = 0; i < this.state.todos.length; i++) {
        arrayTemp[i].render = "true";
        this.setState({ todos: arrayTemp, stat: statTemp });
      }

      itemsRef2.child(this.state.stat.id).update({
        state: "All",
      });
    }
    else if (act === "Act") {
      this.rendersItem(props, "true", "false", "Act");

      itemsRef2.child(this.state.stat.id).update({
        state: "Act",
      });
    }
    else if (act === "Com") {
      this.rendersItem(props, "false", "true", "Com");

      itemsRef2.child(this.state.stat.id).update({
        state: "Com",
      });
    }
    else if (act === "Clc") {
      arrayTemp = this.state.todos;

      for (i = 0; i < this.state.todos.length; i++) {
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
          arrayTemp.splice(i, 1);
        }
      }

      this.setState({ todos: arrayTemp });
    }
  }

  selectItems = (props, act, event) => {
    event.preventDefault();
    this.changeRenderDB(props, act);
  }

  deleteItem = (itemId, event) => {
    event.preventDefault();

    var itemsRef = fire.database().ref('todos');
    itemsRef.child(itemId.id).remove(function (error) {
      if (error) {
        console.log(error);
      }
    });

    var arrayTemp = this.state.todos;
    for (var i = 0; i < this.state.todos.length; i++) {
      if (this.state.todos[i].id === itemId.id) {
        arrayTemp.splice(i, 1);
        this.setState({ todos: arrayTemp });
      }
    }
  }

  rendersItem = (props, renderTrue, renderFalse, stat) => {
    var itemsRef = fire.database().ref('todos');
    var arrayTemp = this.state.todos;

    let statTemp = {
      statt: stat,
      id: this.state.stat.id
    };

    for (var i = 0; i < this.state.todos.length; i++) {
      if (this.state.todos[i].status === "true") {
        itemsRef.child(this.state.todos[i].id).update({
          status: props.todos[i].status,
          text: props.todos[i].text,
          render: renderFalse
        });
      }
      else if (this.state.todos[i].status === "false") {
        itemsRef.child(this.state.todos[i].id).update({
          status: props.todos[i].status,
          text: props.todos[i].text,
          render: renderTrue
        });
      }
    }

    for (i = 0; i < this.state.todos.length; i++) {
      if (this.state.todos[i].status === "true") {
        arrayTemp[i].render = renderFalse;
        this.setState({ todos: arrayTemp, stat: statTemp });
      }
      else if (this.state.todos[i].status === "false") {
        arrayTemp[i].render = renderTrue;
        this.setState({ todos: arrayTemp, stat: statTemp });
      }
    }

  }

  saveItem = (event) => {
    event.preventDefault();

    var renderTemp = ""
    renderTemp = this.state.stat.statt === "Com" ? "false" : 'true';

    fire.database().ref('todos').push({
      status: "false",
      text: this.state.newTodo,
      render: renderTemp,
    });

    this.setState({ newTodo: "" });
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user })

        let messagesRef = fire.database().ref('todos').orderByKey().limitToLast(100);
        let messagesRef2 = fire.database().ref('stat');

        messagesRef.on('child_added', snapshot => {
          var statusDB = Object.values(snapshot.child('status').val());
          var textDB = Object.values(snapshot.child('text').val());
          var renderDB = Object.values(snapshot.child('render').val());

          var textStatus = statusDB.join().split(',').join('')
          var textText = textDB.join().split(',').join('')
          var textRender = renderDB.join().split(',').join('')

          let message = {
            text: textText,
            status: textStatus,
            render: textRender,
            id: snapshot.key
          };

          this.setState({ todos: [message].concat(this.state.todos) });
        })

        messagesRef2.on('child_added', snapshot => {
          var statusDB = Object.values(snapshot.child('state').val());
          var textStat = statusDB.join().split(',').join('')

          let statTemp = {
            statt: textStat,
            id: snapshot.key
          };

          this.setState({ stat: statTemp });
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

