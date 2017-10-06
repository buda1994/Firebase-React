import React, { Component } from 'react';
import './App.css';
import fire from './fire.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import DoneAll from 'material-ui/svg-icons/action/done-all';
import {List,ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Delete from 'material-ui/svg-icons/action/delete';
import AppBar from 'material-ui/AppBar';

class FORM extends Component{
  state = { 
    todov: '',
    messages: [],
    stat: "All",
    editing: ""
  }

  Editing = (props,event) =>{
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

  TODOl = (props) =>{

    if(this.state.editing===props.id){
      if(props.render==="true"){
        return(
          <MuiThemeProvider>
            <form onSubmit={(event)=>this.Editing( props, event )} >
              <TextField onChange={(event)=>this.setState({todov: event.target.value})} hintText={props.text}/>
            </form> 
          </MuiThemeProvider>
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
            
            {/* <MuiThemeProvider>
              <List>
                <ListItem 
                  leftCheckbox={<this.CheckBox todos={props} />} 
                  primaryText={<p onDoubleClick={() => this.setState({editing: props.id})} > {props.text} </p>}  
                  rightIconButton={<FlatButton icon={<Delete/>} onClick={(event) => this.deleteTODO(props, event)} />}/>
              </List>
            </MuiThemeProvider> */}

            

            <this.CheckBox todos={props} /> 

            <div style={{display: 'inline-block'}}>
              <div style={{fontSize: '1.25m', fontWeight: 'bold'}}>

                <p onDoubleClick={() => this.setState({editing: props.id})} > {props.text} </p>
        
              </div>
            </div>

            <MuiThemeProvider>
              <FlatButton icon={<Delete/>} onClick={(event) => this.deleteTODO(props, event)} />
            </MuiThemeProvider> 


            {/* <MuiThemeProvider>
            <form onSubmit={this.saveTODO}>
              <this.CheckAll todos={this.state.messages} />
              <TextField value={this.state.todov} onChange={(event)=>this.setState({todov: event.target.value})} hintText="Arc"  />
            </form> 
            </MuiThemeProvider> */}
            

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
    return(
      <MuiThemeProvider>
        <Checkbox checked={props.todos.status === "true" } onClick={(event) => this.modifyTODO(props, event)} />
      </MuiThemeProvider>
    )
  }

  TODOList = (props) => {
    return (
      <div className="text-center">
        {props.todos.map(todos => <this.TODOl key={todos.id} {...todos} />)}
      </div>
    );
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
        <div style={{margin: '1em'}}>
            <MuiThemeProvider>
              <Toolbar>
                <ToolbarGroup>
                  <span>{count} items left</span>
                </ToolbarGroup>
                <ToolbarGroup>
                  <FlatButton label="All" onClick={(event) => this.selectTODO(props, "All", event)} /> 
                  <FlatButton label="Active" onClick={(event) => this.selectTODO(props, "Act", event)} /> 
                  <FlatButton label="Completed" onClick={(event) => this.selectTODO(props, "Com", event)} /> 
                  <FlatButton label="Clear Completed" onClick={(event) => this.selectTODO(props, "Clc", event)} /> 
                </ToolbarGroup>
              </Toolbar>
            </MuiThemeProvider>
        </div>
      );
    }
  };

  

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
          <FlatButton icon={<DoneAll/>}  onClick={() => this.markAll(props,"aChecked",)}/>
        </MuiThemeProvider>
      );
    }
    else {
      return(
          <MuiThemeProvider>
            <FlatButton icon={<DoneAll/>}  onClick={() => this.markAll(props,"nChecked",)}/>
          </MuiThemeProvider>
      ); 
    }
  };

  markAll = (props,arc) =>{
    // event.preventDefault();

    var sChecked;
    var itemsRef = fire.database().ref('todos');
    var arraym = this.state.messages;

    
    // console.log("current stat: ",this.state.stat)
    // for(var i=0;i<this.state.messages.length;i++){
    //   // if(this.state.messages[i].id===props.todos.id){
    //     // arraym[i].status=sChecked;
    //     console.log("messages ",i," status: ",this.state.messages[i].status)
    //     // console.log("arraym ",i," status: ",arraym[i].status)
    //     // this.setState({messages: arraym });
    //   // }
    // }


    if(arc==="nChecked"){
      sChecked="true"
      // this.setState({chkbox:false})
      // console.log("arc: ",arc)
      // console.log("true");
    }
    else if (arc==="aChecked"){
      sChecked="false"
      // console.log("arc: ",arc)
      // console.log("false");
      // this.setState({chkbox:true})
    }

    // console.log("arc: ",arc);
    // console.log(arraym);
    // console.log("sChecked: ",sChecked)

    for(var i=0;i<this.state.messages.length;i++){
      // console.log("dsa");
      itemsRef.child(this.state.messages[i].id).update({
        status: sChecked,
        text: props.todos[i].text,
        render: props.todos[i].render
      } );
    }

    // console.log("------------------------------------");
    // console.log(itemsRef);
    // console.log("------------------------------------");
    // console.log("props ",props.todos[1].status)

    // console.log(this.state);
    for(i=0;i<this.state.messages.length;i++){
      // if(this.state.messages[i].id===props.todos.id){

        // console.log("messages ",i," status: ",this.state.messages[i].status)
        arraym[i].status=sChecked;
        // console.log("props ",i," status: ",props.todos[i].status)
        // console.log("messages ",i," status: ",this.state.messages[i].status)

        // this.setState({messages: arraym });
      // }
    }
    this.setState({messages: arraym });
    // console.log("messages: ",this.state.messages);
    // console.log("arraym: ",arraym);


    // console.log("dsada",this.state.messages[1].state);
    // this.setState({messages: arraym });
    // this.forceUpdate();

    


    // var arraym = this.state.messages;

    // console.log(props);

    // for(var i=0;i<this.state.messages.length;i++){
    //   // console.log("dsa");

    //   itemsRef.child(this.state.messages[i].id).update({
    //     status: "true",
    //     text: props.todos[i].text,
    //     render: props.todos[i].render
    //   } );
    // }

    // this.selectTODO(props, "Act", event)
    this.arc1(props, this.state.stat.statt);

  }

  arc1 = (props, act) =>{
    var itemsRef = fire.database().ref('todos');
    var itemsRef2 = fire.database().ref('stat');
    var arraym = this.state.messages;
    let statm;
    // console.log(props.todos);
    // console.log("sdasd ",props.todos[1].text);

    // console.log("prev stat State: ",this.state.stat);

    if(act==="All"){
      console.log("Button All")

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


      // let statm = { 
      //   statt: textS,
      //   id: snapshot.key 
      // };
      
      // this.setState({ stat: statm });


      // console.log("stat:",this.state.stat)
      // this.modifyStat("All");

    }
    else if(act==="Act"){
      console.log("Button Act")
      this.rendersTODO(props, "true","false","Act");
      // this.modifyStat("Act");

      itemsRef2.child(this.state.stat.id).update({
        arc: "Act",
      } );
    }
    else if(act==="Com"){
      console.log("Button Com")
      this.rendersTODO(props, "false","true","Com");
      // this.modifyStat("Com");

      itemsRef2.child(this.state.stat.id).update({
        arc: "Com",
      } );
    }
    else if(act==="Clc"){
      // console.log("Clc")

      var array = this.state.messages;
      
      for(i=0;i<this.state.messages.length;i++){
        // console.log(this.state.messages.length);
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
          // console.log("Azeroth");
        }
      }

      this.setState({messages: array });
    }
  }

  selectTODO = (props, act, event) => {
    event.preventDefault();

    this.arc1(props, act);

    // var itemsRef = fire.database().ref('todos');
    // var arraym = this.state.messages;

    // if(act==="All"){
    //   console.log("Button All")
    //   for(var i=0;i<this.state.messages.length;i++){
    //     itemsRef.child(this.state.messages[i].id).update({
    //       status: props.todos[i].status,
    //       text: props.todos[i].text,
    //       render: "true"
    //     } );
    //   }

    //   for(i=0;i<this.state.messages.length;i++){
    //     arraym[i].render="true";
    //     this.setState({messages: arraym, stat: "All" });
    //   }

    // }
    // else if(act==="Act"){
    //   console.log("Button Act")
    //   this.rendersTODO(props, "true","false","Act");
    // }
    // else if(act==="Com"){
    //   console.log("Button Com")
    //   this.rendersTODO(props, "false","true","Com");
    // }
    // else if(act==="Clc"){
    //   // console.log("Clc")

    //   var array = this.state.messages;
      
    //   for(i=0;i<this.state.messages.length;i++){
    //     if(this.state.messages[i].status==="true")
    //     {
    //       itemsRef.child(this.state.messages[i].id).remove(function(error) {
    //         if (error) {
    //           console.log(error);
    //         }
    //       });
    //     }
    //   }

    //   for(i=this.state.messages.length-1;i>= 0;i--){
    //     if(this.state.messages[i].status==="true"){
    //       array.splice(i, 1);
    //       // console.log("Azeroth");
    //     }
    //   }

    //   this.setState({messages: array });
    // }



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
        this.setState({messages: arraym, stat: statm });
      }
      if(this.state.messages[i].status==="false")
      {
        arraym[i].render=rtrue;
        this.setState({messages: arraym, stat: statm });
      }
    }

  }

  // modifyStat = (arc) =>{
  //   var itemsRef = fire.database().ref('stat');
    
  //   console.log("state.stat.id: ",this.state.stat.id)
  //   console.log("arc: ",arc)
    
  //   // itemsRef.child(this.state.stat.id).update({
  //   //   arc
  //   // } );

  //   itemsRef.child(this.state.stat.id).update({
  //     arc: arc
  //   } );

  //   // messagesRef = fire.database().ref('stat');
  //   // messagesRef.on('child_added', snapshot => {
  //   //   var arc1 = snapshot.val();
  //   //   console.log(arc1);
  //   //   this.setState({ stat: arc1 });
  //   // })

  // }

  modifyTODO = (props, event) =>{
    
    var status;
    var renderS;

    // console.log("state stat: ",this.state.stat);
    // console.log("button: ",props.todos.text);
    // console.log("render: ",props.todos.status);
    // console.log("render: ",props.todos.render);

    if (props.todos.status==="false"){
      status="true";
    }
    else if (props.todos.status==="true"){
      status="false";
    }

    
    // console.log("idprops")
    // console.log(props.todos.id);
    // console.log(this.state.stat.statt);
    // console.log(status);
    // console.log(props.todos.text);
    // console.log(renderS);

    // console.log(props)

    if(this.state.stat.statt==="All"){
      renderS="true"
      console.log("All");
    }
    else if (this.state.stat.statt==="Act" && status==="false"){
      renderS="true"
      console.log("Act, false");
      // this.arc1(props, "Act");
    }
    else if (this.state.stat.statt==="Act" && status==="true"){
      renderS="false"
      console.log("Act, true");
      // this.arc1(props, "Act");
    }
    else if (this.state.stat.statt==="Com" && status==="false"){
      renderS="false"
      console.log("Com, false");
      // this.arc1(props, "Com");
    }
    else if (this.state.stat.statt==="Com" && status==="true"){
      renderS="true"
      console.log("Com, true");
      // this.arc1(props, "Com");
    }

    


    var itemsRef = fire.database().ref('todos');

    itemsRef.child(props.todos.id).update({
    // itemsRef.child("-Kvhf3Smxw2rt7w_SdtX").update({
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

    // console.log("------------------")
    // console.log(this.state.messages)
    // console.log("------------------")

    // console.log("----------------")
    // console.log("state stat: ",this.state.stat);
    // console.log("button: ",props.todos.text);
    // console.log("render: ",props.todos.status);
    // console.log("render: ",props.todos.render);
    
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
    let messagesRef = fire.database().ref('todos').orderByKey().limitToLast(100);
    let messagesRef2 = fire.database().ref('stat');

    messagesRef.on('child_added', snapshot => {

      var arc1 = Object.values(snapshot.child('status').val());
      var arc2 = Object.values(snapshot.child('text').val());
      var arc3 = Object.values(snapshot.child('render').val());

      console.log(snapshot.val());
      
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
      // console.log("arc1 ",arc1);
      // console.log("arc1: ",textS)
      let statm = { 
        statt: textS,
        id: snapshot.key 
      };
      
      this.setState({ stat: statm });
      // this.setState({ stat: arc1 });
    })


  }

  render() {
    return (
      <div className="App">
        <MuiThemeProvider>
          <AppBar
            style={{backgroundColor:"black"}}
            title="TODO"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
        </MuiThemeProvider>

        <MuiThemeProvider>
        <form onSubmit={this.saveTODO}>
          <this.CheckAll todos={this.state.messages} />
          <TextField value={this.state.todov} onChange={(event)=>this.setState({todov: event.target.value})} hintText="Arc"  />
        </form> 
        </MuiThemeProvider>
        
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
        {/* <TODOList todos={this.state.messages} /> */}
      </div>
    );
  }
}

export default App;

