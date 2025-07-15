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
import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-ghost-purple text-primary-foreground",
            secondary: "border-ghost-purple/30 bg-ghost-purple/20 text-ghost-neon",
            destructive: "border-transparent bg-red-500/20 text-red-500 border-red-500/30",
            outline: "border-ghost-purple/30 text-ghost-neon",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function Badge(_a) {
    var { className, variant } = _a, props = __rest(_a, ["className", "variant"]);
    return (_jsx("div", Object.assign({ className: cn(badgeVariants({ variant }), className) }, props)));
}
export { Badge, badgeVariants };
//# sourceMappingURL=badge.js.map