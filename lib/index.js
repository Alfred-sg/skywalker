"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require("shelljs"); // https://github.com/shelljs/shelljs
var git_1 = require("./utils/git");
// import { upload } from './utils/oss';
function publish() {
    var branch = git_1.detect();
    if (!branch)
        return;
    // const { env, version } = branch;
    shell.exec('cnpm run build'); // cnpm
    // upload('', '');
}
publish();
