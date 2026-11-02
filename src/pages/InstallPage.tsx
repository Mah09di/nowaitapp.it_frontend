import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPage = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstall, setShowInstall] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    // const [isAndroid, setIsAndroid] = useState(false); // 👈 حذف کنید

    useEffect(() => {
        // تشخیص دستگاه
        const userAgent = navigator.userAgent;
        const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
        // const isAndroidDevice = /Android/.test(userAgent); // 👈 حذف کنید
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;

        setIsIOS(isIOSDevice);
        // setIsAndroid(isAndroidDevice); // 👈 حذف کنید
        setIsStandalone(isStandaloneMode);

        // اگر قبلاً نصب شده، به صفحه اصلی برو
        if (isStandaloneMode) {
            window.location.href = '/profile';
            return;
        }

        // گوش دادن به رویداد beforeinstallprompt (برای اندروید/کروم)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // اگر رویداد beforeinstallprompt فراخوانی نشد، بعد از 3 ثانیه دکمه رو نمایش بده
        const timeout = setTimeout(() => {
            if (!showInstall && !isIOS) {
                setShowInstall(true);
            }
        }, 3000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            clearTimeout(timeout);
        };
    }, [showInstall, isIOS]);

    // هندل نصب برای اندروید/کروم
    const handleInstallClick = async () => {
        if (deferredPrompt) {
            try {
                await deferredPrompt.prompt();
                const result = await deferredPrompt.userChoice;
                if (result.outcome === 'accepted') {
                    console.log('✅ PWA نصب شد');
                    window.location.href = '/profile';
                } else {
                    console.log('❌ نصب رد شد');
                }
                setDeferredPrompt(null);
                setShowInstall(false);
            } catch (error) {
                console.error('خطا در نصب:', error);
            }
        } else {
            // اگر deferredPrompt null بود، راهنمای دستی رو نمایش بده
            alert('برای نصب:\n1. روی دکمه Share بزنید\n2. Add to Home Screen را انتخاب کنید');
        }
    };

    // اگر قبلاً نصب شده، به صفحه اصلی برو
    if (isStandalone) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#33635E] to-[#1a3d39] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* لوگو */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto bg-white/20 rounded-2xl flex items-center justify-center text-5xl shadow-lg mb-4">
                        <img src="/pwa-192x192.png" alt="Nowait" className="w-20 h-20 rounded-xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Nowait</h1>
                    <p className="text-white/70 text-sm mt-1">مدیریت نوبت‌دهی هوشمند</p>
                </div>

                {/* محتوای اصلی */}
                <div className="space-y-6">
                    {/* مزایا */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-white/90 bg-white/10 rounded-xl p-3">
                            <span className="text-2xl">⚡</span>
                            <span className="text-sm">سرعت بالا و آفلاین</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/90 bg-white/10 rounded-xl p-3">
                            <span className="text-2xl">📱</span>
                            <span className="text-sm">تجربه کاربری عالی</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/90 bg-white/10 rounded-xl p-3">
                            <span className="text-2xl">🔔</span>
                            <span className="text-sm">دریافت نوتیفیکیشن</span>
                        </div>
                    </div>

                    {/* دکمه نصب */}
                    {isIOS ? (
                        // راهنمای نصب برای iOS
                        <div className="bg-white/15 rounded-xl p-4 text-center">
                            <p className="text-white/80 text-sm mb-3">
                                برای نصب روی آیفون مراحل زیر را دنبال کنید:
                            </p>
                            <ol className="text-white/90 text-sm space-y-2 text-right">
                                <li className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                                    <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                    <span>دکمه <span className="bg-white/20 px-2 py-0.5 rounded">Share</span> <span className="text-xl">📤</span> را بزنید</span>
                                </li>
                                <li className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                                    <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                    <span>گزینه <span className="bg-white/20 px-2 py-0.5 rounded font-bold">Add to Home Screen</span> را انتخاب کنید</span>
                                </li>
                                <li className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                                    <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                    <span>روی <span className="bg-white/20 px-2 py-0.5 rounded font-bold">Add</span> بزنید</span>
                                </li>
                            </ol>
                        </div>
                    ) : (
                        // دکمه نصب برای اندروید/کروم
                        <button
                            onClick={handleInstallClick}
                            className="w-full py-4 bg-gradient-to-r from-white to-white/90 text-[#33635E] font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span className="text-2xl">📲</span>
                            نصب اپلیکیشن Nowait
                        </button>
                    )}

                    {/* لینک ورود به سایت */}
                    <Link
                        to="/profile"
                        className="block text-center text-white/60 hover:text-white text-sm transition-colors duration-200"
                    >
                        یا وارد سایت شوید
                    </Link>
                </div>

                {/* فوتر */}
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-white/40 text-xs">
                        با نصب، تجربه بهتری از Nowait داشته باشید
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InstallPage;