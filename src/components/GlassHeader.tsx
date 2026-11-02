import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const GlassHeader = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location.pathname]);

    const menuItems = [
        { path: '/profile', icon: '/assets/icon/patient_list.png', label: 'وضعیت در صف انتظار' },
        { path: '/settings', icon: '/assets/icon/diversity_2.png', label: 'درباره ما' },
        { path: '/notifications', icon: '/assets/icon/call.png', label: 'تماس با ما' },
        { path: '/help', icon: '/assets/icon/mobile_3.png', label: 'پنل خدمات دهندگان' },
    ];

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) setIsMenuOpen(false);
    };

    return (
        <>
            {/* Header */}
            <header className="fixed top-2 sm:top-3 md:top-4 left-1/2 transform -translate-x-1/2 z-50 w-full px-3 sm:px-4 md:px-6 font-shabnam">
                <div className="w-full max-w-[1200px] bg-white/10 backdrop-blur-[20px] border border-white/20 rounded-xl md:rounded-2xl shadow-lg mx-auto">
                    <div className="px-3 sm:px-4 md:px-6 py-2 md:py-3">
                        <div className="flex justify-between items-center relative">
                            {/* Desktop Menu */}
                            <div className="hidden lg:flex flex-wrap justify-start items-center gap-3 md:gap-4 lg:gap-6">
                                {menuItems.map((item, index) => {
                                    const isActive = activeItem === item.path;
                                    return (
                                        <Link
                                            key={index}
                                            to={item.path}
                                            onClick={() => setActiveItem(item.path)}
                                            className={`relative flex flex-row-reverse items-center justify-center transition-all duration-300 ease-out`}
                                            style={{
                                                borderRadius: '20px',
                                                padding: '4px 12px',
                                                gap: '6px',
                                                backgroundColor: isActive ? 'white' : 'transparent',
                                                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                                                boxShadow: isActive ? '0 5px 15px rgba(0, 0, 0, 0.1)' : 'none',
                                            }}
                                        >
                                            <img
                                                src={item.icon}
                                                alt={item.label}
                                                className="w-4 h-4 md:w-5 md:h-5 object-contain"
                                                style={{
                                                    filter: isActive
                                                        ? 'invert(24%) sepia(24%) saturate(894%) hue-rotate(120deg) brightness(93%) contrast(85%)'
                                                        : 'brightness(0) invert(1)',
                                                }}
                                            />
                                            <span
                                                className="font-medium text-[14px] md:text-[15px] lg:text-[16px] leading-[100%] transition-colors duration-300"
                                                style={{ color: isActive ? '#2C5753' : 'white' }}
                                            >
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="flex lg:hidden items-center justify-between w-full">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 md:p-2">
                                    <img
                                        src="/assets/icon/dehaze.png"
                                        alt="menu"
                                        className="w-6 h-5 md:w-7 md:h-6"
                                        style={{ filter: 'brightness(0) invert(1)' }}
                                    />
                                </button>
                                <Link
                                    to="/"
                                    className="text-xl font-medium text-white hover:text-white/90 transition-colors"
                                >
                                    <img
                                        src="/assets/img/logo.png"
                                        alt="Nowait"
                                        title="Nowait"
                                        className="w-24 h-8 md:w-28 md:h-10"
                                    />
                                </Link>
                            </div>

                            {/* Desktop Logo */}
                            <div className="hidden lg:flex items-center gap-2 md:gap-3">
                                <Link
                                    to="/"
                                    className="text-xl font-medium text-white hover:text-white/90 transition-colors"
                                >
                                    <img
                                        src="/assets/img/logo.png"
                                        alt="Nowait"
                                        title="Nowait"
                                        className="w-28 h-10 lg:w-32 lg:h-12"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
                        onClick={handleBackdropClick}
                    ></div>

                    {/* Sidebar */}
                    <div
                        className="fixed right-0 top-0 lg:hidden z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col"
                        style={{
                            width: '280px',
                            height: '100vh',
                            backgroundColor: '#F8F5F0',
                            paddingTop: '10px',
                            paddingBottom: '20px',
                        }}
                    >
                        {/* Header */}
                        <div
                            className="flex justify-around items-center px-4"
                            style={{
                                width: '280px',
                                height: '70px',
                                padding: '10px 10px 14px 4px',
                            }}
                        >
                            <h2 className="font-shabnam text-[15px] text-black">منو دسترسی</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-black hover:bg-black/10 rounded-lg transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 text-black"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 18l-6-6 6-6"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col px-4 mt-4 gap-2">
                            {menuItems.map((item, index) => {
                                const isActive = activeItem === item.path;
                                return (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        onClick={() => {
                                            setActiveItem(item.path);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`flex flex-row items-center gap-3 w-full py-3 px-4 rounded-lg transition-all duration-200 
          ${isActive ? 'bg-[#DFEDEC]' : 'hover:bg-[#DFEDEC]'}
        `}
                                        style={{ minWidth: '100px', maxWidth: '260px' }}
                                    >
                                        <img
                                            src={item.icon}
                                            alt={item.label}
                                            className="w-[18px] h-[18px] object-contain"
                                            style={{
                                                filter: 'invert(0) sepia(0) saturate(0) brightness(0%)',
                                            }}
                                        />
                                        <span className="font-shabnam text-[13px] text-black">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default GlassHeader;