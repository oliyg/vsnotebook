import * as vscode from 'vscode';

// NotebookTreeViewProvider
import { NotebookTreeViewProvider } from './notebook-tree-view-provider/index';
import { WorkflowTreeViewProvider, Entry } from './workflow-tree-view-provider/index';
import { WorkflowPanel } from './workflow/node/index';
import { readFileSync, watchFile, unwatchFile, fstat } from 'fs';
import * as path from 'path';
import * as YAML from 'yamljs';

let watchingFile: string = '';

export function activate(context: vscode.ExtensionContext) {

	// workspace notebook explorer
	vscode.window.registerTreeDataProvider('notebook-view', new NotebookTreeViewProvider());
	// workspace workflow tasks explorer
	const workflowTreeViewProvider = new WorkflowTreeViewProvider(context);
	vscode.window.registerTreeDataProvider('workflow-view', workflowTreeViewProvider);

	// commands
	context.subscriptions.push(
		// post message example
		vscode.commands.registerCommand('workflow.sendYaml', sendYamlData.bind(null, context))
	);
}

export function deactivate() { }

function sendYamlData(context: vscode.ExtensionContext, nodeUri: Entry): void {
	if (!nodeUri) { return; }
	if (!WorkflowPanel.currentPanel) {
		WorkflowPanel.createPanel(context.extensionPath);
		return;
	}
	WorkflowPanel.currentPanel?.postMessage({ type: 'workflow.config.send', data: readYamlData(nodeUri) });

	if (watchingFile !== nodeUri.uri.fsPath) {
		unwatchFile(watchingFile, () => {
			WorkflowPanel._curNodeUri = null;
		});
		watchingFile = nodeUri.uri.fsPath;
		WorkflowPanel._curNodeUri = nodeUri;
	}
	watchFile(nodeUri.uri.fsPath, { interval: 200 }, () => {
		WorkflowPanel.currentPanel?.postMessage({ type: 'workflow.config.send', data: readYamlData(nodeUri) });
	});
}

function readYamlData(nodeUri: Entry): string {
	let workflowJSON;
	try {
		workflowJSON = YAML.parse(readFileSync(nodeUri.uri.fsPath).toString());
	} catch (error) {
		vscode.window.showErrorMessage(error.message);
	}
	return workflowJSON;
}