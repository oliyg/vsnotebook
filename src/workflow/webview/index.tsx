import * as React from "react";
import * as ReactDOM from "react-dom";
import { D3Contatiner } from "./d3-container";

function WorkflowApp() {
  return <D3Contatiner />;
}

ReactDOM.render(<WorkflowApp />, document.getElementById("root"));
