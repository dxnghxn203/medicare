"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    FiTruck,
    FiUser,
    FiLogOut,
    FiMenu,
    FiX,
    FiChevronDown,
    FiHelpCircle,
    FiRefreshCw
} from "react-icons/fi";

export default function PartnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const pathname = usePathname();

    // Check if we're on mobile on mount and when window resizes
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobileView(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        // Initial check
        checkIfMobile();

        // Add event listener
        window.addEventListener('resize', checkIfMobile);
        
        // Clean up
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // Simplified navigation - only status update functionality
    const navigation = [
        { name: 'Cập nhật trạng thái', href: '/status-order', icon: FiRefreshCw },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && isMobileView && (
                <div 
                    className="fixed inset-0 z-20 bg-gray-800/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Simplified */}
            <aside
                className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-lg">ĐT</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-900">Đối tác vận chuyển</span>
                        </div>
                        {isMobileView && (
                            <button 
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-gray-500 hover:text-gray-700"
                            >
                                <FiX size={24} />
                            </button>
                        )}
                    </div>

                    {/* Navigation - Simplified */}
                    <div className="flex-1 overflow-y-auto py-4 px-3">
                        <nav className="space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-5 w-5 ${
                                                isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-500'
                                            }`}
                                        />
                                        {item.name}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Footer/User Profile */}
                    <div className="p-4 border-t">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <FiUser size={20} />
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Đối tác vận chuyển</p>
                                <p className="text-xs text-gray-500 truncate">shipper@example.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`lg:pl-64 flex flex-col min-h-screen`}>
                {/* Top Header - Simplified */}
                <header className="bg-white shadow z-10">
                    <div className="flex items-center justify-between px-4 py-3 lg:px-6">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <FiMenu size={24} />
                        </button>

                        <div className="font-medium text-lg text-gray-900 lg:hidden">
                            Cập nhật trạng thái đơn
                        </div>

                        {/* Right buttons - Simplified */}
                        <div className="flex items-center space-x-4">
                            {/* Help */}
                            <button className="text-gray-500 hover:text-gray-700">
                                <FiHelpCircle size={20} />
                            </button>

                          
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    {/* Close dropdowns when clicking elsewhere */}
                    {/* {profileDropdownOpen && (
                        <div 
                            className="fixed inset-0 z-20" 
                            onClick={() => setProfileDropdownOpen(false)}
                        />
                    )}
                     */}
                    {/* Render children (page content) */}
                    <div className="py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
