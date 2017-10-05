import React, { Component } from 'react';
import './App.css';
import fire from './fire.js';


class FORM extends Component{
  state = { 
    todov: '',
    messages: [],
    stat: "All"
  }
  
  TODOl = (props) =>{

    // console.log("////////////")
    // console.log("button: ",props.text,", render: ",props.render)
    // console.log("////////////")

    

    if(props.render==="true"){
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

  CheckBox = (props) =>{
    // console.log("CheckBox props.todos.status: ",props.todos.status);
    

    if(props.todos.status==="false"){
      // console.log("CheckBox ",props.todos.status," not checked");
      return(
        <input className="ChackboxA" onClick={(event) => this.modifyTODO(props, event)} type="checkBox" />
      )
    }
        
    if(props.todos.status==="true"){
      // console.log("CheckBox ",props.todos.status," checked");
      return(
        <div>
          <input className="ChackboxA" onClick={(event) => this.modifyTODO(props, event)} type="checkBox" defaultChecked/>
        </div>
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

    // console.log(x === y);
    if( count === props.todos.length && count>0){
    // if(   x === y ){
      // console.log("checked");
      return(
          // console.log("");
          // <input className="ChackboxA" onClick={(event) => this.markAll(props,"aChecked",event)} type="checkBox" />
          <div>
          <input className="ChackboxA" onClick={() => this.markAll(props,"aChecked",)} type="checkBox" defaultChecked/>
          </div>
      );
    }
    // else if (   x !== y ){
    // else if ( count !== props.todos.length ){
    else {
      // console.log("notchecked: ",count);
      // console.log("not checked");
      return(
        
        
          // <input className="ChackboxA" onClick={(event) => this.markAll(props,"nChecked",event)} type="checkBox" />
          
          <input className="ChackboxA" onClick={() => this.markAll(props,"nChecked",)} type="checkBox" />
          
        // <button onClick={(event) => this.selectTODO(props, "All", event)} > All </button>

        // <input className="ChackboxA" onClick={(event) => this.markAll(props)} type="checkBox" />
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
    }
    else if(act==="Com"){
      console.log("Button Com")
      this.rendersTODO(props, "false","true","Com");
      // this.modifyStat("Com");
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

    
    console.log("idprops")
    console.log(props.todos.id);
    console.log(this.state.stat.statt);
    console.log(status);
    console.log(props.todos.text);
    console.log(renderS);

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
        <header className="App-header">
          <h1 className="App-title">TODOS</h1>
        </header>
        <hr/>

        <form onSubmit={this.saveTODO}>
          {/* <input className="ChackboxA" onClick={(event) => this.markAll(this.state.messages)} type="checkBox" /> */}
          <this.CheckAll todos={this.state.messages} />
          
          <input type="text" 
            onChange={(event)=>this.setState({todov: event.target.value})}
            placeholder="Arc" 
            id="txtb" required/>
        </form> 
        
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

