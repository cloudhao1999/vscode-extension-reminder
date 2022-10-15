import dayjs = require('dayjs');
import duration = require('dayjs/plugin/duration');
import * as vscode from 'vscode';

export function setupDayjs() {
    dayjs.extend(duration);
}

/**
 * 格式化本地时间
 * @param timeStr 传入的时间字符串
 * @returns dayjs对象
 */
export function formatLocalStringTime(timeStr: string): string {
    return dayjs(`${dayjs().format('YYYY-MM-DD')} ${timeStr}`).format();
}

/**
 * 计算是否下班
 * @returns 是否下班
 */
export function calcDuration() {
    const timeStr: string = vscode.workspace.getConfiguration('xiabanlema').get('xiabanTime') || '18:00';
    const endTime = formatLocalStringTime(timeStr);

    const duration = dayjs.duration(dayjs(endTime).diff(dayjs()));
    let hours = duration.hours();
    let minutes = duration.minutes() % 60;
    let seconds = duration.seconds() % 60;
    let dayInWeek = dayjs().day();
    const isOutOfWork = hours <= 0 && minutes <= 0 && seconds <= 0;
    // 后续再加上节假日判断
    const isWeekend = dayInWeek === 0 || dayInWeek === 6;
    return {
        isOutOfWork,
        isWeekend,
        hours,
        minutes,
        seconds
    };
}
