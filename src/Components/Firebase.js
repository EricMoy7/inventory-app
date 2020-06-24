/* UserID or uid is saved immediately on login into the sessionStorage
Use the following lines of code to retrieve data on any file

const userData = JSON.parse(sessionStorage.getItem("userData"));
    console.log(userData.uid);

The uid can be used to access the database for each user.
*/

import Firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCccryJhiE5khJ3XYvSmzIsujG9aGdJpSg",
  authDomain: "inventorywebapp-d01bc.firebaseapp.com",
  databaseURL: "https://inventorywebapp-d01bc.firebaseio.com",
  projectId: "inventorywebapp-d01bc",
  storageBucket: "inventorywebapp-d01bc.appspot.com",
  messagingSenderId: "11196585164",
  appId: "1:11196585164:web:9ef107a7c3fa25c2375e69",
  measurementId: "G-43HL2EDJDJ",
};

Firebase.initializeApp(firebaseConfig);
const auth = Firebase.auth();
const db = Firebase.firestore();

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User has logged in");
    sessionStorage.setItem("userData", JSON.stringify(user));
  } else {
    console.log("User has logged out");
    sessionStorage.setItem("userData", null);
  }
});

export { auth, db };
