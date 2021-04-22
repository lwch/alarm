// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import scheduleJob from 'node-schedule';
import { gists } from './gists';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
	// scheduleJob('* * * * *', function() {
	// 	vscode.window.showInformationMessage('abc', 'def');
	// });
	var g = new gists(vscode.workspace.getConfiguration('alarm').get('gists.token')+'');
	g.append('abc');
	vscode.window.showInformationMessage('abc', 'done', 'undo').then(function(sel) {
		console.log(sel);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
