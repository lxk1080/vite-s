/**
 * 测试下 tsc 编译：npx tsc --target es5 --module umd --lib es2015,dom .\src\ts\qwer.ts
 *  - 在使用 tsc 命令时，只有其后不加任何参数，才会使用 tsconfig.json 配置进行编译检查
 *  - 所以当我们指定编译的文件时，tsc 不会使用 tsconfig.json 的编译配置，此时需要我们自己添加一些编译参数
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lodash"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var lodash_1 = require("lodash");
    var func = function () { console.log(123, (0, lodash_1.random)(0, 5)); };
    exports.default = func;
});
