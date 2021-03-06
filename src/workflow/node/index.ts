import * as vscode from 'vscode';
import { readFileSync, fstat, writeFileSync } from 'fs';
import { Entry } from '../../workflow-tree-view-provider';
import { resolve } from 'path';
import * as path from 'path';
import * as YAML from 'yamljs';

export class WorkflowPanel {
    public static currentPanel: WorkflowPanel | undefined;
    public static _curNodeUri: Entry | null = null;

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;

    private _disposables: vscode.Disposable[] = [];

    public static createPanel(extensionPath: string) {
        return new Promise((resolve, reject) => {
            const panel = vscode.window.createWebviewPanel(
                'workflow',
                'Workflow',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );
            panel.iconPath = vscode.Uri.file(path.resolve(extensionPath, 'assets/img/workflow.icon.svg'));
            WorkflowPanel.currentPanel = new WorkflowPanel(panel, extensionPath);
            resolve();
        });
    }

    private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
        this._panel = panel;
        this._extensionPath = extensionPath;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._initHtml();

        this._panel.webview.onDidReceiveMessage(msg => {
            this._onDidReceiveMessage(msg);
        }, null, undefined);
    }
    // dispose
    public dispose() {
        WorkflowPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    // handle postMessage
    private _onDidReceiveMessage(msg: { type: string, data: any }): void {
        switch (msg.type) {
            case 'workflow.d3.save':
                console.log("TCL: WorkflowPanel -> workflow.d3.save", msg.data);
                let WorkflowYAML = YAML.stringify(msg.data);
                if (WorkflowPanel._curNodeUri) {
                    try {
                        writeFileSync(WorkflowPanel._curNodeUri.uri.fsPath, WorkflowYAML);
                    } catch (error) {
                        vscode.window.showErrorMessage('Write file error');
                    }
                }
                return;
            case 'workflow.d3.error':
                vscode.window.showErrorMessage(msg.data);
                return;
        }
    }

    /**
     * send a serialized data message to webview
     */
    public postMessage(msg: { type: string, data: any }) {
        this._panel.webview.postMessage(msg);
    }

    private _initHtml(): void {
        const webview = this._panel.webview;
        this._panel.title = 'Workflow Panel';
        webview.html = this._getWorkflowWebview();
    }

    private _getWorkflowWebview(): string {
        let resPath = path.join(resolve(this._extensionPath, 'out/workflow/index.html'));
        let dirPath = path.dirname(resPath);
        let file: string = readFileSync(resPath).toString();

        file = file.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
            return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
        });
        return file;
    }
}
