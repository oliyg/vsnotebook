import * as vscode from 'vscode';
import { ContentsManager } from '@jupyterlab/services';

// NotebookTreeViewProvider
import { NotebookTreeViewProvider } from './notebook-tree-view-provider/index';

export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider('notebook-view', new NotebookTreeViewProvider());

	let contents = new ContentsManager();
	contents.get('').then(model => {
		console.log('files:', model.content);
	}).catch(console.log);

}

export function deactivate() { }
