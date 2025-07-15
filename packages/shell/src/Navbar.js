'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search, Settings, User, X, ChevronLeft, Plus } from "lucide-react";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image';
// Type-safe wrappers for components
const SafeLink = Link;
const SafeImage = Image;
const SearchIcon = Search;
const SettingsIcon = Settings;
const UserIcon = User;
const XIcon = X;
const ChevronLeftIcon = ChevronLeft;
const PlusIcon = Plus;
const Navbar = ({ onLoginClick, onSignUpClick }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();
    // Check if we're on the homepage
    const isHomepage = pathname === '/';
    const isNoteDetailPage = pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/notes/');
    const handleBack = () => {
        if (isNoteDetailPage) {
            router.push('/');
        }
        else {
            router.back();
        }
    };
    const handleLoginClick = () => {
        if (onLoginClick) {
            onLoginClick();
        }
        else if (pathname === '/') {
            // If we're on the homepage, we're expecting the auth modal to be there
            // Just trigger a custom event that the homepage can listen for
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
            }
        }
        else {
            // If we're not on the homepage, navigate to the homepage with a query param
            router.push('/?auth=login');
        }
    };
    const handleSignUpClick = () => {
        if (onSignUpClick) {
            onSignUpClick();
        }
        else if (onLoginClick) {
            onLoginClick();
        }
        else if (pathname === '/') {
            // If we're on the homepage, we're expecting the auth modal to be there
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }));
            }
        }
        else {
            // If we're not on the homepage, navigate to the homepage with a query param
            router.push('/?auth=signup');
        }
    };
    // Focus the search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);
    // Close search on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isSearchOpen]);
    // Listen for auth modal events when on homepage
    useEffect(() => {
        if (pathname === '/' && typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const authParam = urlParams.get('auth');
            if (authParam === 'login' || authParam === 'signup') {
                window.dispatchEvent(new CustomEvent('open-auth-modal', {
                    detail: { mode: authParam }
                }));
                // Clean up the URL
                const newUrl = `${window.location.pathname}${window.location.search.replace(/[?&]auth=\w+/, '')}`;
                window.history.replaceState({}, '', newUrl);
            }
        }
    }, [pathname]);
    return (_jsx("nav", { className: "sticky top-0 z-50 w-full border-b border-ghost-purple/20 bg-ghost-dark/80 backdrop-blur-md", children: _jsxs("div", { className: "container mx-auto flex h-16 sm:h-16 items-center justify-between px-4 sm:px-6 gap-4", children: [_jsx("div", { className: `flex items-center transition-all duration-300 ${isSearchOpen ? 'md:flex w-0 md:w-auto opacity-0 md:opacity-100' : 'w-auto opacity-100'}`, children: isHomepage ? (_jsxs(SafeLink, { href: "/", className: "flex items-center gap-2 group", children: [_jsx(SafeImage, { src: "/logo.svg", alt: "GhostNote Logo", width: 28, height: 28, className: "h-7 w-7 transition-transform duration-300 group-hover:scale-110" }), _jsx("h1", { className: "text-2xl font-bold bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent transition-opacity duration-300 group-hover:opacity-80", children: "GhostNote" })] })) : (_jsxs(Button, { onClick: handleBack, variant: "ghost", className: "flex items-center text-gray-300 hover:text-ghost-neon gap-1 px-2", children: [_jsx(ChevronLeftIcon, { className: "h-5 w-5" }), _jsx("span", { className: "font-medium", children: "Back" })] })) }), _jsx("div", { className: "hidden md:flex flex-1 max-w-md mx-4 lg:mx-6", children: _jsxs("div", { className: "relative w-full", children: [_jsx(SearchIcon, { className: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" }), _jsx(Input, { type: "search", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onFocus: () => router.push('/search'), onClick: () => router.push('/search'), placeholder: "Search notes, authors, and tags...", className: "pl-11 pr-4 bg-ghost-gray/50 border-ghost-purple/30 text-white text-sm placeholder:text-gray-400 focus:bg-ghost-gray/80 focus:border-ghost-purple/60 w-full h-10 cursor-pointer", readOnly: true })] }) }), _jsxs("div", { className: "hidden md:flex items-center space-x-1 lg:space-x-2", children: [_jsx(Button, { variant: "ghost", size: "sm", className: "text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus:ring-0 text-sm", onClick: handleLoginClick, children: "Login" }), _jsx(Button, { size: "sm", className: "bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-medium hover:from-ghost-neon hover:to-ghost-cyan focus:outline-none focus:ring-0 text-sm", onClick: handleSignUpClick, children: "Sign Up" }), _jsx(Button, { asChild: true, size: "sm", className: "bg-gradient-to-r from-ghost-cyan to-ghost-neon text-black font-medium hover:from-ghost-neon hover:to-ghost-cyan focus:outline-none focus:ring-0 text-sm", children: _jsx(SafeLink, { href: "/create", children: _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(PlusIcon, { className: "h-4 w-4" }), "Create"] }) }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus-ring-0 h-10 w-10", children: _jsx(SettingsIcon, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "md:hidden flex items-center justify-end flex-1", children: isSearchOpen ? (_jsx("div", { className: "w-full flex items-center animate-in fade-in duration-300", children: _jsxs("div", { className: "relative w-full flex items-center", children: [_jsx(SearchIcon, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-10" }), _jsx(Input, { ref: searchInputRef, type: "search", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onFocus: () => router.push('/search'), onClick: () => router.push('/search'), placeholder: "Search...", className: "pl-12 pr-12 bg-ghost-gray/50 border-ghost-purple/30 text-white text-base placeholder:text-gray-400 focus:bg-ghost-gray/80 focus:border-ghost-purple/60 w-full h-12 cursor-pointer", readOnly: true }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
                                        setIsSearchOpen(false);
                                        setSearchQuery('');
                                    }, className: "absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-gray-400 hover:text-ghost-neon z-10", children: _jsx(XIcon, { className: "h-6 w-6" }) })] }) })) : (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => router.push('/search'), className: "text-gray-300 hover:text-ghost-neon focus:outline-none focus:ring-0 h-12 w-12", children: _jsx(SearchIcon, { className: "h-6 w-6" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: handleLoginClick, className: "text-gray-300 hover:text-ghost-neon focus:outline-none focus:ring-0 h-12 w-12", children: _jsx(UserIcon, { className: "h-6 w-6" }) })] })) })] }) }));
};
export default Navbar;
//# sourceMappingURL=Navbar.js.map