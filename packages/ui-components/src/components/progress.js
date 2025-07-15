"use client";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
const Progress = React.forwardRef((_a, ref) => {
    var { className, value = 0, max = 100, size = "default", showValue = false, valueFormat = "percent" } = _a, props = __rest(_a, ["className", "value", "max", "size", "showValue", "valueFormat"]);
    const percentage = (value / max) * 100;
    const displayValue = valueFormat === "percent" ? `${Math.round(percentage)}%` : `${value}/${max}`;
    return (_jsxs("div", Object.assign({ ref: ref, className: cn("relative w-full overflow-hidden rounded-full bg-ghost-dark/30 border border-ghost-purple/20", size === "default" ? "h-2" : "h-1", className) }, props, { children: [_jsx("div", { className: "h-full w-full flex-1 bg-gradient-to-r from-ghost-purple to-ghost-neon transition-all", style: { width: `${percentage}%` } }), showValue && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center text-xs font-medium text-white", children: displayValue }))] })));
});
Progress.displayName = "Progress";
export { Progress };
//# sourceMappingURL=progress.js.map