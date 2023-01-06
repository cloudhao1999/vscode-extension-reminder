import dayjs = require('dayjs');
import * as vscode from 'vscode';
import { getConfiguration } from '../util/config';
import { calcDuration, formatLocalStringTime } from '../util/time';

// 下班主类
export default class XiaBan {
    // 底部状态栏
    xiabanStatusItem: vscode.StatusBarItem;
    // 下班指令
    xiabanCommand: string = 'xiabanlema.xiaban';
    // 注册下班指令
    xiabanRegister!: vscode.Disposable;
    // 注册配置变化事件
    xiabanConfiguration!: vscode.Disposable;

    constructor() {
	    this.xiabanStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	    this.xiabanStatusItem.command = this.xiabanCommand;
	    this.xiabanStatusItem.tooltip = '下班了吗？';
        
        this.registerCommand();
    }

    // 判断是否快下班
    isOutOfWorkSoon() {
        const notificationTime: number = getConfiguration('notificationTime') || 30;
        const xiabanTimeStr: string = getConfiguration('xiabanTime') || '18:00';
        const xiabanTime = formatLocalStringTime(xiabanTimeStr);

        const notificationTimeParse = dayjs(xiabanTime).subtract(notificationTime, 'minute');
        if (dayjs().format('YYYY-MM-DD HH:mm') === notificationTimeParse.format('YYYY-MM-DD HH:mm')) {
            return true;
        }
        return false;
    }

    // 事件通知
    notifyFunc() {
        const isOutOfWorkSoon = this.isOutOfWorkSoon();
        const notificationTime: boolean = getConfiguration('notification');
        if (isOutOfWorkSoon && notificationTime) {
            vscode.window.showInformationMessage('下班时间快到啦！');
        }
    }

    registerCommand() {
        this.xiabanRegister = vscode.commands.registerCommand(this.xiabanCommand, () => {
            const { isOutOfWork, hours, minutes } = calcDuration();
            if (isOutOfWork) {
                vscode.window.showInformationMessage('还上啥班啊，下班了！！！');
            } else {
                const message = `还有${hours}小时${minutes}分钟下班`;
                vscode.window.showInformationMessage(message);
            }
        });

        this.xiabanConfiguration = vscode.workspace.onDidChangeConfiguration(() => {
            this.updateStatusBarItem();
            this.notifyFunc();
        });
        
    }

    updateStatusBarItem(): void {
        const { isOutOfWork, hours, minutes } = calcDuration();
        if (isOutOfWork) {
            this.xiabanStatusItem.text = `$(rocket) 下班了`;
        } else {
            const message = `$(symbol-event) ${hours}小时${minutes}分`;
            this.xiabanStatusItem.text = message;
        }
        this.xiabanStatusItem.show();
    }
}