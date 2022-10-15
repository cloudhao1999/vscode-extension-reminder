import dayjs = require('dayjs');
import * as vscode from 'vscode';
import { setupDayjs } from './util/time';
import XiaBan from "./core/index";


let timer: NodeJS.Timer;
const xiaban = new XiaBan();

export function activate(context: vscode.ExtensionContext) {
	setupDayjs();

	context.subscriptions.push(xiaban.xiabanStatusItem);
	context.subscriptions.push(xiaban.xiabanRegister);

	xiaban.updateStatusBarItem();
	timer = setInterval(xiaban.updateStatusBarItem, 1000);
}


export function deactivate() {
	timer && clearInterval(timer);
}
