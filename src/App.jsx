import "./App.css";

import { useState } from "react";

function App() {
  const [heading, setHeading] = useState("Magnificient monkeys");

  const clickHandler = () => {
    setHeading("Radical Rhinos");
  }

  return (<>
    <h1>{heading}</h1>
    <button type="button" onClick={clickHandler}>Click me</button>
  </>);
}

export default App;
