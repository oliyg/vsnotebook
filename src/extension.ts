import * as vscode from 'vscode';

// NotebookTreeViewProvider
import { NotebookTreeViewProvider } from './notebook-tree-view-provider/index';

export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider('notebook-view', new NotebookTreeViewProvider());
}

export function deactivate() {}
