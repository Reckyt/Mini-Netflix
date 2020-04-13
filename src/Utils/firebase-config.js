import { initializeApp } from "firebase";

export const initFirebase = () => {
  var firebaseConfig = {
    apiKey: "AIzaSyCIqvZUSFWNfLznnKKF789eqKUwanzUfU4",
    authDomain: "maxflix-cf6da.firebaseapp.com",
    databaseURL: "https://maxflix-cf6da.firebaseio.com",
    projectId: "maxflix-cf6da",
    storageBucket: "maxflix-cf6da.appspot.com",
    messagingSenderId: "23626976781",
    appId: "1:23626976781:web:7fc1eff36038734ef84f44",
  };
  initializeApp(firebaseConfig);
};
