import * as vscode from 'vscode';
import * as fs from 'fs';
import YAML from 'yamljs';
import { Entry } from './workflow-tree-view-provider/index';
import { WorkflowPanel } from './workflow/node';
import { store } from './store';

export class CommandsHandler {
    constructor(context: vscode.ExtensionContext) {
        new YAMLHandler(context);
    }
}

class YAMLHandler {
    constructor(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.commands.registerCommand('workflow.sendYaml', this._sendYamlData.bind(null, context))
        );
    }

    private _sendYamlData(context: vscode.ExtensionContext, nodeUri: Entry): void {
        if (!nodeUri) { return; }
        if (!WorkflowPanel.currentPanel) {
            WorkflowPanel.createPanel(context.extensionPath);
            return;
        }
        WorkflowPanel.currentPanel?.postMessage({ type: 'workflow.config.send', data: this._readYamlData(nodeUri) });

        if (store.watchingFile !== nodeUri.uri.fsPath) {
            fs.unwatchFile(store.watchingFile, () => {
                WorkflowPanel._curNodeUri = null;
            });
            store.watchingFile = nodeUri.uri.fsPath;
            WorkflowPanel._curNodeUri = nodeUri;
        }
        fs.watchFile(nodeUri.uri.fsPath, { interval: 200 }, () => {
            WorkflowPanel.currentPanel?.postMessage({ type: 'workflow.config.send', data: this._readYamlData(nodeUri) });
        });
    }

    private _readYamlData(nodeUri: Entry): string {
        let workflowJSON;
        try {
            workflowJSON = YAML.parse(fs.readFileSync(nodeUri.uri.fsPath).toString());
        } catch (error) {
            vscode.window.showErrorMessage(error.message);
        }
        return workflowJSON;
    }
}
