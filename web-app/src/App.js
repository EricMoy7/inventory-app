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
      <Navigation />
      <h1>Hello</h1>
    </div>
  );
}

export default App;
