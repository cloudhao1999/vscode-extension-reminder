import * as vscode from 'vscode';

export function getConfiguration<T extends any>(property: string): T {
    return vscode.workspace.getConfiguration('xiabanlema').get(property)!;
};
