import * as vscode from 'vscode';
import { extname } from 'path';

export class NotebookTreeViewProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined> = new vscode.EventEmitter<TreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
    return ['example.json', 'notebook.ipynb'].map((item, index) => new TreeItem(item, String(index)));
  }
}

class TreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly id: string,
  ) {
    super(label);
  }
  get tooltip(): string {
    return `Open file ${this.label}`;
  }

  get description(): string | boolean {
    if (this.isNotebook(this.label)) {
      return `Open file ${this.label}`;
    } else {
      return false;
    }
  }

  isNotebook(filePath: string): boolean {
    return extname(filePath) === '.ipynb';
  }
}
