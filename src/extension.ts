import * as vscode from 'vscode';

// NotebookTreeViewProvider
import { NotebookTreeViewProvider } from './notebook-tree-view-provider/index';
import { WorkflowPanel } from './workflow/index';

export function activate(context: vscode.ExtensionContext) {

	// workspace notebook explorer
	vscode.window.registerTreeDataProvider('notebook-view', new NotebookTreeViewProvider());
	// workflow panel
	WorkflowPanel.createPanel(context.extensionPath);
}

export function deactivate() { }
