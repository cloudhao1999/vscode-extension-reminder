import * as vscode from 'vscode';
import { calcDuration } from '../util/time';

// 下班主类
export default class XiaBan {
    // 底部状态栏
    xiabanStatusItem: vscode.StatusBarItem;
    // 下班指令
    xiabanCommand: string = 'xiabanlema.xiaban';
    // 注册下班指令
    xiabanRegister!: vscode.Disposable;

    constructor() {
	    this.xiabanStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	    this.xiabanStatusItem.command = this.xiabanCommand;
	    this.xiabanStatusItem.tooltip = '下班了吗？';
        
        this.registerCommand();
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
    }

    updateStatusBarItem(): void {
        const { isOutOfWork, hours, minutes } = calcDuration();
        if (isOutOfWork) {
            this.xiabanStatusItem.text = `$(thumbsup) 下班了`;
        } else {
            const message = `$(thumbsdown) ${hours}小时${minutes}分`;
            this.xiabanStatusItem.text = message;
        }
        this.xiabanStatusItem.show();
    }
}