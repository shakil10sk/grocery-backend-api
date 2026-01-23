'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import Header from '../../components/common/Header';
import Navigation from '../../components/common/Navigation';
import Footer from '../../components/common/Footer';
export const MainLayout = ({ children })=>{
    return /*#__PURE__*/ _jsxs("div", {
        className: "flex flex-col min-h-screen",
        children: [
            /*#__PURE__*/ _jsx(Header, {}),
            /*#__PURE__*/ _jsx(Navigation, {}),
            /*#__PURE__*/ _jsx("main", {
                className: "flex-1 bg-white",
                children: children
            }),
            /*#__PURE__*/ _jsx(Footer, {})
        ]
    });
};
export default MainLayout;
