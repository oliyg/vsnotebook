import * as React from "react";
import { useState } from "react";
import { Fragment, useEffect, useRef } from "react";
// import { debounce } from "throttle-debounce";
import { WorkflowChart } from "./d3-workflow.js";

interface VSCodeInterface {
  postMessage(message: any): void;
}
declare const vscode: VSCodeInterface;

export function D3Contatiner() {
  const refWorkflowContainer = useRef(null);
  const [workflowChartData, setWorkflowChartData] = useState(null);
  // const exampleData = JSON.parse(
  //   '{"Tasks":[{"task":{"name":"nb1","next":{"fail":"nb3","success":"nb2"},"retry":5}},{"task":{"name":"nb2","next":{"fail":null,"success":"nb4"},"retry":5}},{"task":{"name":"nb3","next":{"fail":null,"success":"nb4"},"retry":2}},{"task":{"name":"nb4","next":{"fail":null,"success":null},"retry":4}}],"name":"wf1","trigger":"*/5 * * * *"}'
  // );
  let workflowChart: WorkflowChart;

  useEffect(() => {
    window.addEventListener("message", onPostMessage);
    if (refWorkflowContainer.current) {
      workflowChart = new WorkflowChart(refWorkflowContainer.current);
      // window.postMessage(
      //   { type: "workflow.config.send", data: exampleData },
      //   "*"
      // );
    }
  });

  const onPostMessage = (event: MessageEvent): void => {
    const message = event.data;
    switch (message.type) {
      case "workflow.config.send":
        try {
          refWorkflowContainer.current && workflowChart.init(message.data);
          setWorkflowChartData(message.data);
        } catch (error) {
          vscode.postMessage({
            type: "workflow.d3.error",
            data: error.message
          });
        }
        break;
    }
  };

  const Messaging = (props: { workflowChartData: [] | null }) => {
    const workflowChartData = props.workflowChartData;
    console.log("TCL: Messaging -> workflowChartData", workflowChartData);
    if (workflowChartData) {
      return null;
    } else {
      return (
        <h3 style={{ fontFamily: "monospace", textAlign: "center" }}>
          Select yaml config file from workflow view.
        </h3>
      );
    }
  };

  return (
    <Fragment>
      <div>
        <Messaging workflowChartData={workflowChartData}></Messaging>
      </div>
      <div
        ref={refWorkflowContainer}
        style={{ width: "100%", height: "100%" }}
      ></div>
    </Fragment>
  );
}
