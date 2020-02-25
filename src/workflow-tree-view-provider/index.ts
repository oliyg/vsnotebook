import * as vscode from 'vscode';
import * as path from 'path';
import * as _ from '../utils';

export interface Entry {
  uri: vscode.Uri
  type: vscode.FileType
}

export class WorkflowTreeViewProvider implements vscode.TreeDataProvider<Entry> {

  private _context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
  }

  private _readDir(dirPath: string): Promise<Entry[]> {
    return new Promise<Entry[]>(async (resolve, reject) => {
      const children = await _.readdir(dirPath);
      const result: [string, vscode.FileType][] = [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const stat = await _.stat(path.join(dirPath, child));
        // filter yaml file
        if (path.extname(child) === '.yaml' || stat.isDirectory()) {
          result.push([child, stat.isFile() ? vscode.FileType.File : vscode.FileType.Directory]);
        }
      }
      let res = result.map(([name, type]) => {
        return { uri: vscode.Uri.file(path.resolve(this._context.extensionPath, dirPath, name)), type };
      });
      resolve(res);
    });
  }

  async getChildren(element?: Entry): Promise<Entry[]> {
    return element ?
      this._readDir(element.uri.fsPath) :
      this._readDir(path.resolve(this._context.extensionPath, 'assets/data'));
  }

  getTreeItem(element: Entry): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(element.uri, element.type === vscode.FileType.Directory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
    if (element.type === vscode.FileType.File) {
      // todo
      // treeItem.command = { command: '', title: "Open workflow", arguments: [element.uri], };
      treeItem.contextValue = 'file';
    }
    return treeItem;
  }
}

export class WorkflowTreeView {
  constructor(context: vscode.ExtensionContext) {
    vscode.window.registerTreeDataProvider('workflow-view', new WorkflowTreeViewProvider(context));
  }
}