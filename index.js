/**
 * @file 文件介绍
 * @author imcooder@gmail.com
 */
/* eslint-disable fecs-camelcase */
/* eslint-disable */
/* jshint esversion:8 */
/* jshint node:true */
'use strict';

const util = require('util');
const stdin = process.openStdin();
const stdout = process.stdout;
const stderr = process.stderr;
const EventEmitter = require('events');

class EE extends EventEmitter {
    constructor() {
        super();
        this.buffer = '';
        stdin.setEncoding('utf8');
        stdin.on('data', (data) => {
            if (data) {
                this.buffer += data;
                while (this.buffer.match(/\r?\n/)) {
                    this.buffer = RegExp.rightContext;
                    this.emit('line', RegExp.leftContext);
                }
            }
        });
        stdin.on('end', () => {
            if (this.buffer) {
                this.emit('line', this.buffer);
            }
            this.emit('end');
        });
    }
    write() {
        for (let i = 0; i < arguments.length; i++) {
            stdout.write(String(arguments[i]));
        }
    }
    writeln() {
        for (let i = 0; i < arguments.length; i++) {
            stdout.write(String(arguments[i]));
        }
        stdout.write('\n');
    }
    print() {
        let args = [].slice.apply(arguments);
        stdout.write(args.join(' '));
    }
    println() {
        let args = [].slice.apply(arguments);
        stdout.write(args.join(' '));
        stdout.write('\n');
    }
    printFormat() {
        let s = util.format.apply(null, arguments);
        stdout.write(s);
    }
    writeError() {
        for (let i = 0; i < arguments.length; i++) {
            stderr.write(arguments[i]);
        }
    }
    split(str, reg = /\s/, maxCount = 100000) {
        var count = 1;
        var left = str;
        var res = [];
        var index = 0;
        while (count < maxCount && left && left.match(reg)) {
            res.push(RegExp.leftContext);
            left = RegExp.rightContext;
            count++;
        }
        if (left) {
            res.push(left);
        }
        return res;
    }
    parseJson(data) {
        let json;
        try {
            json = JSON.parse(data);
        } catch (e) {
            stderr.write('Error Processing:' + data + ' ERROR:' + e + '\n');
        }
        return json;
    }
    toJson(data) {
        return JSON.stringify(data);
    }
    toReadableJson(data) {
        return JSON.stringify(data, null, 4);
    }
    toDict(str) {
        let dict = {};
        let p = this.split(str);
        if (!p.length) {
            return dict;
        }
        p.forEach((item) => {
            if (!item) {
                return;
            }
            let parts = this.split(item, /:/, 2);
            if (!parts || parts.length < 2) {
                return;
            }
            dict[parts[0]] = parts[1];
        });
        return dict;
    }
    dictToString(dict) {
        let out = '';
        if (!dict) {
            return out;
        }
        let arr = [];
        for (let key in dict) {
            let value = this.toString(dict[key]);
            arr.push(`${key}:${value}`);
        }
        out = arr.join(' ');
        return out;
    }
    // yyyy.MM.dd_hhmmss.S
    formatDate(date, fmt) {
        if (!util.isDate(date)) {
            return '';
        }
        let o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            'S': date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    }
    toString(obj) {
        let str = '';
        if (util.isString(obj)) {
            str = obj;
        } else if (util.isBuffer(obj)) {
            try {
                str = obj.toString();
            } catch (error) {
                str = '';
            }
        } else if (util.isFunction(obj)) {
            str = '[Function]';
        } else if (util.isArray(obj) || util.isObject(obj)) {
            try {
                str = JSON.stringify(obj);
            } catch (error) {
                console.error('json stringify failed:', obj);
            }
        } else if (obj === undefined || obj === null) {
            str = '';
        } else {
            try {
                str = obj.toString();
            } catch (error) {
                console.error('json stringify failed:', obj);
            }
        }
        return str;
    }
    trimStringLeft(str, charset) {
        if (!str || !charset) {
            return str;
        }
        let firstNotIn = -1;
        for (let i = 0; i < str.length; i++) {
            if (charset.indexOf(str.charAt(i)) === -1) {
                firstNotIn = i;
                break;
            }
        }
        if (firstNotIn < 0) {
            return '';
        }
        return str.substr(firstNotIn);
    }

    trimStringRight(str, charset) {
        if (!str || !charset) {
            return str;
        }
        let lastFirstNotIn = -1;
        for (let i = str.length - 1; i >= 0; i--) {
            if (charset.indexOf(str.charAt(i)) === -1) {
                lastFirstNotIn = i;
                break;
            }
        }
        if (lastFirstNotIn < 0) {
            return '';
        }
        return str.substr(0, lastFirstNotIn + 1);
    }

    trimString(str, charset) {
        if (!str || !charset) {
            return str;
        }
        return this.trimStringLeft(this.trimStringRight(str, charset), charset);
    }
    trimToken(token) {
        if (!token) {
            return '';
        }
        if (token.toLowerCase().startsWith('bearer')) {
            token = token.substr(6);
        }
        token = this.trimString(token, '\ _');
        return token;
    }
    getAccessTokenExpiredAt(token) {
        let tokens = token.split('.');
        if (tokens.length !== 5) {
            return;
        }
        let ids = tokens[4].split('-');
        if (ids.length < 2) {
            return;
        }
        return parseInt(tokens[3], 10);
    }
    static isTest(cuid) {
        if (cuid.indexOf('monitor') !== -1) {
            return true;
        }
        if (cuid.indexOf('test') !== -1) {
            return true;
        }
        return false;
    }
    pause() {
        stdin.pause();
    }

    resume() {
        stdin.resume();
    }

    static trimQuery(query, maxQueryLen = 32) {
        if (query.length < maxQueryLen) {
            return query;
        }
        return query.substring(0, maxQueryLen) + '...';
    }
}

module.exports = EE;
