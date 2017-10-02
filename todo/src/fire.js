import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "AIzaSyC76tkR_c8TEIZAZ89xuMT-KtJkS-k0VSU",
    authDomain: "todo-74822.firebaseapp.com",
    databaseURL: "https://todo-74822.firebaseio.com",
    projectId: "todo-74822",
    storageBucket: "todo-74822.appspot.com",
    messagingSenderId: "169985755582"
};
var fire = firebase.initializeApp(config);
export default fire;