// App.js - Input editable UI

import React, { useState } from "react";
import Navigation from "./components/Navigation/Navigation";

function App() {
  // State for the input
  const [task, setTask] = useState("");

  /*
    Enclose the input element as the children to the Editable component to make it as inline editable.
  */
  return (
    <div>
      <Navigation />
    </div>
  );
}

export default App;
