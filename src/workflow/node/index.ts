import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as path from 'path';

export class WorkflowPanel {
    public static currentPanel: WorkflowPanel | undefined;

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;

    public static createPanel(extensionPath: string) {
        const panel = vscode.window.createWebviewPanel(
            'workflow',
            'Workflow',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        panel.iconPath = vscode.Uri.file(resolve(extensionPath, 'assets/img/workflow.icon.svg'));
        WorkflowPanel.currentPanel = new WorkflowPanel(panel, extensionPath);
    }

    private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
        this._panel = panel;
        this._extensionPath = extensionPath;

        this._initHtml();

        // this._panel.webview.onDidReceiveMessage(msg => {
        //     this._onDidReceiveMessage(msg);
        // }, null, undefined);
    }

    // handle postMessage
    // private _onDidReceiveMessage(msg: { type: string, data: any }): void {
    //     switch (msg.type) {
    //         case 'workflow-yaml':
    //             console.log("TCL: WorkflowPanel -> workflow-yaml", msg.data);
    //             vscode.window.showInformationMessage('get workflow yaml');
    //             // todo
    //             return;
    //     }
    // }

    /**
     * send a serialized data message to webview
     */
    public postMessage(msg: { type: number, data: any }) {
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
