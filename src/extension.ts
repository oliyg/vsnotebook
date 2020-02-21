import * as vscode from 'vscode';

// NotebookTreeViewProvider
import { NotebookTreeViewProvider } from './notebook-tree-view-provider/index';
import { WorkflowPanel } from './workflow/node/index';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as YAML from 'yamljs';
import { PostMessage } from './workflow/node/consts';

export function activate(context: vscode.ExtensionContext) {

	// workspace notebook explorer
	vscode.window.registerTreeDataProvider('notebook-view', new NotebookTreeViewProvider());
	// workflow panel
	WorkflowPanel.createPanel(context.extensionPath);
	setTimeout(() => {
		// post message example
		console.log("TCL: activate -> setTimeout", 'load workflow yaml to json data and send msg to webview');
		let workflowJSON = YAML.parse(readFileSync(resolve(context.extensionPath, 'assets/data/source.yaml')).toString());
		WorkflowPanel.currentPanel?.postMessage({ type: PostMessage.WorkflowYaml, data: workflowJSON });
	}, 0);
}

export function deactivate() { }
