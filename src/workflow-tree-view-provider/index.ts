import * as vscode from 'vscode';
import YAML from 'yamljs';
import * as fs from 'fs';
import * as path from 'path';

export interface Entry {
  uri: vscode.Uri
  type: vscode.FileType
}

namespace _ {
  export function stat(dirPath: string): Promise<fs.Stats> {
    return new Promise<fs.Stats>((resolve, reject) => {
      fs.stat(dirPath, (error, res) => {
        if (error) { reject(error); }
        else { resolve(res); }
      });
    });
  }
  export function readdir(dirPath: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir(dirPath, (error, children) => {
        if (error) { reject(error); }
        else { resolve(children); }
      });
    });
  }
}

export class WorkflowTreeViewProvider implements vscode.TreeDataProvider<Entry> {

  private _context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
  }
  async getChildren(element?: Entry): Promise<Entry[]> {
    if (!element) {
      // get initial element
      const rootPath = path.resolve(this._context.extensionPath, 'assets/data');
      const children = await _.readdir(rootPath);
      const result: [string, vscode.FileType][] = [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const stat = await _.stat(path.join(rootPath, child));
        // filter yaml file
        if (path.extname(child) === '.yaml' || stat.isDirectory()) {
          result.push([child, stat.isFile() ? vscode.FileType.File : vscode.FileType.Directory]);
        }
      }
      let res = result.map(([name, type]) => {
        return { uri: vscode.Uri.file(path.resolve(this._context.extensionPath, rootPath, name)), type };
      });
      return Promise.resolve(res);
    } else {
      const curPath = element.uri.fsPath;
      const children = await _.readdir(curPath);
      const result: [string, vscode.FileType][] = [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const stat = await _.stat(path.join(curPath, child));
        // filter yaml fil
        if (path.extname(child) === '.yaml' || stat.isDirectory()) {
          result.push([child, stat.isFile() ? vscode.FileType.File : vscode.FileType.Directory]);
        }
      }
      let res = result.map(([name, type]) => {
        return { uri: vscode.Uri.file(path.resolve(curPath, name)), type };
      });
      return Promise.resolve(res);
    }
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
