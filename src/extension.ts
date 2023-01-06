import * as vscode from 'vscode';
import { setupDayjs } from './util/time';
import XiaBan from "./core/index";
import { getConfiguration } from './util/config';


let timer: NodeJS.Timer;
const xiaban = new XiaBan();

export function activate(context: vscode.ExtensionContext) {
	setupDayjs();

	context.subscriptions.push(xiaban.xiabanStatusItem);
	context.subscriptions.push(xiaban.xiabanRegister);
	context.subscriptions.push(xiaban.xiabanConfiguration);

	xiaban.updateStatusBarItem();
	xiaban.notifyFunc();

	timer && clearInterval(timer);
	timer = setInterval(() => {
		xiaban.updateStatusBarItem();
		// 判断是否需要监听下班时间
		const notificationTime: boolean = getConfiguration('notification'); 
		if (notificationTime) {
			xiaban.notifyFunc();
		}
	}, 1000 * 35);
}


export function deactivate() {
	timer && clearInterval(timer);
}
