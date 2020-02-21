import { workflowChartHandler } from "./d3-workflow";

const vscode = acquireVsCodeApi();

export function initPostMessage() {
  console.log("TCL: initPostMessage -> initPostMessage");
  window.addEventListener("message", event => {
    const message = event.data;
    switch (message.type) {
      case "workflow.config.send":
        try {
          workflowChartHandler(message.data);
        } catch (error) {
          vscode.postMessage({
            type: "workflow.d3.error",
            data: error.message
          });
        }
        break;
    }
  });
}
