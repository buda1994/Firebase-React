import React, { Component } from 'react';
import './App.css';
import fire from './fire.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import DoneAll from 'material-ui/svg-icons/action/done-all';
import Done from 'material-ui/svg-icons/action/done';
import TextField from 'material-ui/TextField';
import Delete from 'material-ui/svg-icons/action/delete';
import AppBar from 'material-ui/AppBar';
import Active from 'material-ui/svg-icons/image/crop-square';
import firebase from 'firebase'

class FORM extends Component{
  state = { 
    todov: '',
    messages: [],
    stat: "All",
    editing: "",
    user: ""
  }

  AddBOx = () =>{
    if (this.state.user){
      return(
        <MuiThemeProvider>
        <form onSubmit={this.saveTODO}>
          <this.CheckAll todos={this.state.messages} />
          <TextField style={{marginBottom:"40px", marginTop:"30px"}} value={this.state.todov} onChange={(event)=>this.setState({todov: event.target.value})} hintText="Arc"  />
        </form> 
        </MuiThemeProvider>
      )
    }
    else{
      return(
        <div></div>
      )
    }
  }

  HEADER = () =>{
    if (this.state.user){
      return(
        <MuiThemeProvider>
          <AppBar
            style={{backgroundColor:"black"}}
            title={this.state.user.displayName}
            iconClassNameLeft={'url(' +this.state.user.email.photoURL+ ')'}
            iconElementRight={<FlatButton label="Sign-Out" onClick={(event) => this.logout(event)} />}
          />
        </MuiThemeProvider>
      )
    }
    else{
      return(
        <MuiThemeProvider>
          <AppBar
            style={{backgroundColor:"black"}}
            title="TODO"
            iconClassNameLeft="muidocs-icon-navigation-expand-more"
            iconElementRight={<FlatButton label="Sign-In" onClick={(event) => this.login(event)} />}
          />
        </MuiThemeProvider>
      )
    }
  }

  TODOList = (props) => {
    if (this.state.user){
      return(
          <div className="text-center">
            {props.todos.map(todos => <this.TODOl key={todos.id} {...todos} />)}
          </div>
      )
    }
    else{
      return(
        <div>

        </div>
      )
    }
  };

  TODOl = (props) =>{
    if(this.state.editing===props.id){
      if(props.render==="true"){
        return(
          <div>
            <form onSubmit={(event)=>this.editing( props, event )} >
              <MuiThemeProvider>
                <TextField onChange={(event)=>this.setState({todov: event.target.value})} hintText={props.text}/>
              </MuiThemeProvider>
            </form> 
          </div>
        );
      }
      else if(props.render==="false"){
        return(
          <div style={{margin: '1em'}}>
            
          </div>
        );
      }
    }
    else {
      if(props.render==="true"){
        return(
          <div >
            <div style={{display: 'inline-block', width: "25%"}}>
              <this.CheckBox todos={props} /> 
            </div>
            <div style={{display: 'inline-block', width: "50%"}}>
              <p onDoubleClick={() => this.setState({editing: props.id})} > {props.text} </p>
            </div>
            <div style={{display: 'inline-block', width: "25%"}}>
              <MuiThemeProvider>
                <FlatButton icon={<Delete/>} onClick={(event) => this.deleteTODO(props, event)} />
              </MuiThemeProvider> 
            </div>
          </div>
        );
      }
      else if(props.render==="false"){
        return(
          <div style={{margin: '1em'}}></div>
        );
      }
    }
  };
  
  CheckBox = (props) =>{
    if(props.todos.status === "true"){
      return(
        <MuiThemeProvider>     
          <FlatButton icon={<Done/>} onClick={(event) => this.modifyTODO(props, event)}/>
        </MuiThemeProvider>
      )
    }
    else{
      return(
        <MuiThemeProvider>   
          <FlatButton icon={<Active/>} onClick={(event) => this.modifyTODO(props, event)}/>
        </MuiThemeProvider>
      )
    }
  }

  CheckAll = (props) =>{
    var count=0;

    for(var i=0;i<props.todos.length;i++){
      if(props.todos[i].status==="true"){
        count++;
      }
    }
    if( count === props.todos.length && count>0){
      return(
        <MuiThemeProvider>
          <FlatButton icon={<DoneAll/>}  onClick={() => this.markAll(props,"false",)}/>
        </MuiThemeProvider>
      );
    }
    else {
      return(
        <MuiThemeProvider>
          <FlatButton icon={<DoneAll/>}  onClick={() => this.markAll(props,"true",)}/>
        </MuiThemeProvider>
      ); 
    }
  };

  BottomBar = (props) =>{
    var count=0;

    for(var i=0;i<props.todos.length;i++){
      if(props.todos[i].status==="false"){
        count++;
      }
    }

    if(props.todos.length===0){
      return(
        <div style={{margin: '1em'}}></div>
      );
    }
    else{
      return(
        <div style={{marginTop:"50px", margin: '1em'}}>
          <MuiThemeProvider>
            <Toolbar style={{backgroundColor:"black"}}>
              <ToolbarGroup>
                <span style={{color:"white"}}>{count} items left</span>
              </ToolbarGroup>
              <ToolbarGroup>
                <FlatButton style={{backgroundColor:"black", color:"white"}} label="All" onClick={(event) => this.selectTODO(props, "All", event)} /> 
                <FlatButton style={{backgroundColor:"black", color:"white"}} label="Active" onClick={(event) => this.selectTODO(props, "Act", event)} /> 
                <FlatButton style={{backgroundColor:"black", color:"white"}} label="Completed" onClick={(event) => this.selectTODO(props, "Com", event)} /> 
                <FlatButton style={{backgroundColor:"black", color:"white"}} label="Clear Completed" onClick={(event) => this.selectTODO(props, "Clc", event)} /> 
              </ToolbarGroup>
            </Toolbar>
          </MuiThemeProvider>
        </div>
      );
    }

  };

  login = (event) =>{
    event.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  logout = (event) =>{
    event.preventDefault();
    firebase.auth().signOut();
    this.setState({messages: []})
  }

  markAll = (props,arc) =>{
    var itemsRef = fire.database().ref('todos');
    var arraym = this.state.messages;

    for(var i=0;i<this.state.messages.length;i++){
      itemsRef.child(this.state.messages[i].id).update({
        status: arc,
        text: props.todos[i].text,
        render: props.todos[i].render
      } );
    }

    for(i=0;i<this.state.messages.length;i++){
        arraym[i].status=arc;
    }

    this.setState({messages: arraym });
    this.changeRenderDB(props, this.state.stat.statt);

  }

  editing = (props,event) =>{
    event.preventDefault();
    var textA;

    if(this.state.todov===""){
      textA=props.text;
    }
    else{
      textA=this.state.todov;
    }

    var itemsRef = fire.database().ref('todos');
    itemsRef.child(props.id).update({
      status: props.status,
      text: textA,
      render: props.render
    } );

    var arraym = this.state.messages;
    for(var i=0;i<this.state.messages.length;i++){
      if(this.state.messages[i].id===props.id){
        arraym[i].text=textA;
        this.setState({messages: arraym, editing: " " , todov: ""});
      }
    }
  }

  changeRenderDB = (props, act) =>{
    var itemsRef = fire.database().ref('todos');
    var itemsRef2 = fire.database().ref('stat');
    var arraym = this.state.messages;
    let statm;

    if(act==="All"){

      for(var i=0;i<this.state.messages.length;i++){
        itemsRef.child(this.state.messages[i].id).update({
          status: props.todos[i].status,
          text: props.todos[i].text,
          render: "true"
        } );
      }

      statm = { 
        statt: "All",
        id: this.state.stat.id
      };

      for(i=0;i<this.state.messages.length;i++){
        arraym[i].render="true";
        this.setState({messages: arraym, stat: statm });
      }

      itemsRef2.child(this.state.stat.id).update({
        arc: "All",
      } );
    }
    else if(act==="Act"){
      this.rendersTODO(props, "true","false","Act");

      itemsRef2.child(this.state.stat.id).update({
        arc: "Act",
      } );
    }
    else if(act==="Com"){
      this.rendersTODO(props, "false","true","Com");

      itemsRef2.child(this.state.stat.id).update({
        arc: "Com",
      } );
    }
    else if(act==="Clc"){
      var array = this.state.messages;
      
      for(i=0;i<this.state.messages.length;i++){
        if(this.state.messages[i].status==="true"){
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
        }
      }

      this.setState({messages: array });
    }
  }

  selectTODO = (props, act, event) => {
    event.preventDefault();

    this.changeRenderDB(props, act);
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

  rendersTODO = (props, rtrue, rfalse, stat)=>{

    var itemsRef = fire.database().ref('todos');
    var arraym = this.state.messages;

    let statm = { 
      statt: stat,
      id: this.state.stat.id
    };

    for(var i=0;i<this.state.messages.length;i++){

      if(this.state.messages[i].status==="true"){
        itemsRef.child(this.state.messages[i].id).update({
          status: props.todos[i].status,
          text: props.todos[i].text,
          render: rfalse
        } );
      }
      else if(this.state.messages[i].status==="false"){
        itemsRef.child(this.state.messages[i].id).update({
          status: props.todos[i].status,
          text: props.todos[i].text,
          render: rtrue
        } );
      }

    }

    for(i=0;i<this.state.messages.length;i++){

      if(this.state.messages[i].status==="true"){
        arraym[i].render=rfalse;
        this.setState({messages: arraym, stat: statm });
      }
      if(this.state.messages[i].status==="false"){
        arraym[i].render=rtrue;
        this.setState({messages: arraym, stat: statm });
      }
    }

  }

  modifyTODO = (props, event) =>{
    var status;
    var renderS;
    var itemsRef = fire.database().ref('todos');

    if (props.todos.status==="false"){
      status="true";
    }
    else if (props.todos.status==="true"){
      status="false";
    }

    if(this.state.stat.statt==="All"){
      renderS="true"
    }
    else if (this.state.stat.statt==="Act" && status==="false"){
      renderS="true"
    }
    else if (this.state.stat.statt==="Act" && status==="true"){
      renderS="false"
    }
    else if (this.state.stat.statt==="Com" && status==="false"){
      renderS="false"
    }
    else if (this.state.stat.statt==="Com" && status==="true"){
      renderS="true"
    }

    itemsRef.child(props.todos.id).update({
      status: status,
      text: props.todos.text,
      render: renderS
    } );

    var arraym = this.state.messages;
    for(var i=0;i<this.state.messages.length;i++){
      if(this.state.messages[i].id===props.todos.id){
        arraym[i].status=status;
        arraym[i].render=renderS;
        this.setState({messages: arraym });
      }
    }
  }

  saveTODO = (event) => {
    event.preventDefault();

    var arc5=""
    if(this.state.stat.statt==="Com"){
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

    this.setState({ todov: ""});
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => {
      if (user){
        this.setState({user: user})

        let messagesRef = fire.database().ref('todos').orderByKey().limitToLast(100);
        let messagesRef2 = fire.database().ref('stat');
    
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
        
        messagesRef2.on('child_added', snapshot => {
          var arc1 = Object.values(snapshot.child('arc').val());
          var textS = arc1.join().split(',').join('')
    
          let statm = { 
            statt: textS,
            id: snapshot.key 
          };
          
          this.setState({ stat: statm });
        })
      }
      else{
        this.setState({user: null})
      }
    })
  }

  render() {
    return (
      <div className="App">
        <this.HEADER/>
        <this.AddBOx/>
        <this.TODOList todos={this.state.messages}/>
        <this.BottomBar todos={this.state.messages}/>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <FORM />
      </div>
    );
  }
}

export default App;

