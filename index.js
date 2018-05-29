/**
 * @file 文件介绍
 * @author imcooder@gmail.com
 */
/* eslint-disable fecs-camelcase */
/* eslint-disable */
/* jshint esversion:6 */
/* jshint node:true */
'use strict';

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
    writeError() {
        for (let i = 0; i < arguments.length; i++) {
            stderr.write(arguments[i]);
        }
    }
    split(str, reg = /\s/, maxCount) {
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
}

module.exports = EE;