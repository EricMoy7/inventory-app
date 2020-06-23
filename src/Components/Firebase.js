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
  } else {
    console.log("User has logged out");
  }
});

export { auth, db };
