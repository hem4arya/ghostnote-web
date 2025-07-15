import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
// React 19 compatibility wrappers
const StarIcon = Star;
const ShoppingCartIcon = ShoppingCart;
const LinkSafe = Link;
const NoteCard = ({ note }) => {
    const router = useRouter();
    const handlePurchase = () => {
        // Simulate purchase process
        toast.loading("Processing purchase...", {
            duration: 1500,
        });
        setTimeout(() => {
            toast.success(`Successfully purchased "${note.title}"!`);
            // Navigate to reader view after simulated purchase
            router.push(`/reader/${note.id}`);
        }, 1500);
    };
    return (_jsxs("div", { className: "group relative overflow-hidden rounded-xl bg-gradient-to-br from-ghost-dark/50 to-ghost-gray/30 backdrop-blur-sm border border-ghost-purple/20 transition-all duration-300 hover:border-ghost-purple/50 hover:shadow-2xl hover:shadow-ghost-purple/20 flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center justify-between p-2 bg-ghost-dark/90", children: [_jsx("div", { className: "px-2 py-0.5 rounded-full bg-ghost-purple/80 backdrop-blur-sm", children: _jsx("span", { className: "text-xs sm:text-sm font-medium text-white", children: note.category }) }), _jsxs("div", { className: "flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm", children: [_jsx(StarIcon, { className: "w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 text-ghost-neon fill-current" }), _jsx("span", { className: "text-xs sm:text-sm font-medium text-white", children: note.rating })] })] }), _jsx(LinkSafe, { href: `/notes/${note.id}`, className: "px-3 pt-2 pb-0 block", children: _jsx("h3", { className: "font-bold text-base sm:text-lg md:text-lg text-white line-clamp-2 group-hover:text-ghost-neon transition-colors", children: note.title }) }), _jsx(LinkSafe, { href: `/notes/${note.id}`, className: "relative overflow-hidden flex-grow block", children: _jsx("div", { className: "w-full h-auto min-h-[7rem] p-3 pt-1 bg-ghost-dark/60", children: _jsx("p", { className: "text-[13px] sm:text-sm md:text-base text-gray-400 break-words", children: note.previewText.length > 200
                            ? note.previewText.substring(0, 200)
                            : note.previewText }) }) }), _jsxs("div", { className: "p-3 pt-2 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-xs sm:text-sm text-ghost-gray", children: [_jsxs("span", { className: "font-medium text-ghost-purple", children: ["by ", note.author] }), _jsxs("span", { className: "text-ghost-gray", children: [note.reviews, " reviews"] })] }), _jsxs("div", { className: "flex items-center justify-between pt-1", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "text-sm sm:text-base md:text-base font-bold text-ghost-neon", children: "$" }), _jsx("span", { className: "text-base sm:text-lg md:text-lg font-bold text-ghost-neon", children: note.price })] }), _jsxs(Button, { size: "sm", className: "bg-gradient-to-r from-ghost-neon to-ghost-cyan text-black font-medium hover:from-ghost-cyan hover:to-ghost-neon transition-all duration-300 focus:outline-none focus:ring-0 border-0 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3", onClick: handlePurchase, children: [_jsx(ShoppingCartIcon, { className: "w-3 h-3 sm:w-4 sm:h-4 mr-1" }), "Buy Now"] })] })] }), _jsx(LinkSafe, { href: `/notes/${note.id}`, className: "absolute inset-0 bg-gradient-to-br from-ghost-purple/10 via-transparent to-ghost-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" })] }));
};
export default NoteCard;
//# sourceMappingURL=NoteCard.js.map