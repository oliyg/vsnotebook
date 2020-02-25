import * as vscode from 'vscode';

// NotebookTreeViewProvider
import { NotebookTreeView } from './notebook-tree-view-provider/index';
import { WorkflowTreeView } from './workflow-tree-view-provider/index';
import { CommandsHandler } from './commands';

export function activate(context: vscode.ExtensionContext) {

	// treeview
	new NotebookTreeView(context);
	new WorkflowTreeView(context);
	// commands
	new CommandsHandler(context);

}

export function deactivate() { }
