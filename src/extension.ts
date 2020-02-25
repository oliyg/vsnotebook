import * as vscode from 'vscode';

// NotebookTreeViewProvider
import { NotebookTreeViewProvider } from './notebook-tree-view-provider/index';
import { WorkflowTreeViewProvider } from './workflow-tree-view-provider/index';
import { WorkflowPanel } from './workflow/node/index';
import { readFileSync, watchFile, writeFileSync } from 'fs';
import { resolve } from 'path';
import * as YAML from 'yamljs';

export function activate(context: vscode.ExtensionContext) {

	// workspace notebook explorer
	vscode.window.registerTreeDataProvider('notebook-view', new NotebookTreeViewProvider());
	// workspace workflow tasks explorer
	const workflowTreeViewProvider = new WorkflowTreeViewProvider(context);
	vscode.window.registerTreeDataProvider('workflow-view', workflowTreeViewProvider);
	// read example yaml file data source
	// workflowTreeViewProvider.readFile('assets/data/source.yaml');

	// workflow panel
	WorkflowPanel.createPanel(context.extensionPath);
	// commands
	context.subscriptions.push(
		// post message example
		vscode.commands.registerCommand('workflow.sendYaml', sendYamlData.bind(null, context))
	);
	watchFile(resolve(context.extensionPath, 'assets/data/source.yaml'), { interval: 200 }, sendYamlData.bind(null, context));
}

export function deactivate() { }

function sendYamlData(context: vscode.ExtensionContext) {
	if (WorkflowPanel.currentPanel) {
		let workflowJSON;
		try {
			workflowJSON = YAML.parse(readFileSync(resolve(context.extensionPath, 'assets/data/source.yaml')).toString());
		} catch (error) {
			vscode.window.showErrorMessage(error.message);
		}
		console.log("TCL: sendYamlData -> workflowJSON", workflowJSON);
		writeFileSync(resolve(context.extensionPath, 'assets/data/source.json'), JSON.stringify(workflowJSON));
		WorkflowPanel.currentPanel?.postMessage({ type: 'workflow.config.send', data: workflowJSON });
	} else {
		WorkflowPanel.createPanel(context.extensionPath);
	}
}