// App.js - Input editable UI

import React, { useState } from "react";
import Navigation from "./Components/Navigation/Navigation";

function App() {
  // State for the input
  const [task, setTask] = useState("");

  /*
    Enclose the input element as the children to the Editable component to make it as inline editable.
  */
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <Navigation />
    </div>
  );
}

export default App;
