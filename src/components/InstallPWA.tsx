import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstall, setShowInstall] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [bannerClosed, setBannerClosed] = useState(false);

    useEffect(() => {
        // تشخیص iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(isIOSDevice);

        // بررسی حالت standalone (نصب شده)
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(isStandaloneMode);

        // چک کردن اینکه کاربر قبلاً بنر رو بسته باشه
        const closed = localStorage.getItem('pwa-banner-closed') === 'true';
        setBannerClosed(closed);

        // گوش دادن به رویداد beforeinstallprompt (برای اندروید/کروم)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // گوش دادن به تغییرات display-mode
        const handleDisplayModeChange = (e: MediaQueryListEvent) => {
            setIsStandalone(e.matches);
            if (e.matches) {
                setShowInstall(false);
            }
        };

        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        mediaQuery.addEventListener('change', handleDisplayModeChange);

        // ثبت در کنسول برای دیباگ
        console.log('📱 InstallPWA Status:', {
            isIOS: isIOSDevice,
            isStandalone: isStandaloneMode,
            bannerClosed: closed,
            userAgent: navigator.userAgent
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            mediaQuery.removeEventListener('change', handleDisplayModeChange);
        };
    }, []);

    // هندل نصب برای اندروید/کروم
    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;

            if (result.outcome === 'accepted') {
                setShowInstall(false);
                console.log('✅ PWA نصب شد');
            } else {
                console.log('❌ نصب رد شد');
            }

            setDeferredPrompt(null);
        } catch (error) {
            console.error('خطا در نصب:', error);
        }
    };

    // بستن بنر و ذخیره در localStorage
    const handleCloseBanner = () => {
        setShowInstall(false);
        setBannerClosed(true);
        localStorage.setItem('pwa-banner-closed', 'true');
    };

    // اگر قبلاً نصب شده یا بنر بسته شده، هیچ چیزی نشون نده
    if (isStandalone || bannerClosed) {
        return null;
    }

    // نمایش راهنمای نصب برای iOS
    if (isIOS) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-[#33635E] to-[#4A8C85] shadow-xl border-t-4 border-white/20 animate-slide-up">
                <div className="max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                        {/* آیکون */}
                        <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                            📱
                        </div>

                        {/* محتوا */}
                        <div className="flex-1 text-white">
                            <h4 className="text-sm font-bold flex items-center gap-2">
                                نصب اپلیکیشن Nowait
                                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">iOS</span>
                            </h4>
                            <p className="text-xs text-white/80 mt-1 leading-relaxed">
                                برای نصب روی آیفون مراحل زیر را دنبال کنید:
                            </p>
                            <ol className="text-xs text-white/90 mt-2 space-y-1.5 list-none">
                                <li className="flex items-center gap-2">
                                    <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                                    <span>دکمه <span className="inline-block bg-white/20 px-2 py-0.5 rounded text-[10px]">Share</span> <span className="text-lg">📤</span> را بزنید</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                                    <span>گزینه <span className="inline-block bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">Add to Home Screen</span> را انتخاب کنید</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                                    <span>روی <span className="inline-block bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">Add</span> بزنید</span>
                                </li>
                            </ol>
                        </div>

                        {/* دکمه بستن */}
                        <button
                            onClick={handleCloseBanner}
                            className="flex-shrink-0 text-white/60 hover:text-white text-xl transition-colors duration-200 hover:scale-110 transform"
                            aria-label="بستن"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // نمایش دکمه نصب برای اندروید/کروم/دسکتاپ
    if (showInstall) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-[#33635E] to-[#4A8C85] shadow-xl border-t-4 border-white/20 animate-slide-up">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        {/* آیکون */}
                        <div className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                            📲
                        </div>

                        {/* محتوا */}
                        <div className="flex-1 text-white">
                            <h4 className="text-sm font-bold">نصب اپلیکیشن Nowait</h4>
                            <p className="text-xs text-white/80">نصب کنید و تجربه بهتری داشته باشید</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">✓ آفلاین</span>
                                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">✓ سریع</span>
                            </div>
                        </div>

                        {/* دکمه نصب */}
                        <button
                            onClick={handleInstallClick}
                            className="px-5 py-2.5 bg-white text-[#33635E] text-sm font-bold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap"
                        >
                            نصب
                        </button>

                        {/* دکمه بستن */}
                        <button
                            onClick={handleCloseBanner}
                            className="flex-shrink-0 text-white/60 hover:text-white text-xl transition-colors duration-200 hover:scale-110 transform"
                            aria-label="بستن"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};