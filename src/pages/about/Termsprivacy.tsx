const TermsPrivacy = () => {
    const handleBack = () => {
        window.history.back();
    };

    const handleAccept = () => {
        console.log("قوانین پذیرفته شد");
        window.location.href = "/profile";
    };

    return (
        <div dir="rtl" lang="fa" className="min-h-screen w-full flex justify-center bg-[#F3F1EA] font-[Vazirmatn]">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        html, body, #root { height: 100%; }
        button:active { transform: scale(0.98); }
        .terms-scroll::-webkit-scrollbar { width: 4px; }
        .terms-scroll::-webkit-scrollbar-thumb { background: #DEDBD3; border-radius: 4px; }
      `}</style>

            <div className="w-full max-w-[480px] h-screen bg-[#F3F1EA] flex flex-col pt-[env(safe-area-inset-top)] overflow-hidden">

                <div className="flex justify-start items-center px-5 py-3">
                    <button
                        type="button"
                        onClick={handleBack}
                        aria-label="بازگشت"
                        className="w-[38px] h-[38px] rounded-xl border-none bg-transparent flex items-center justify-center cursor-pointer p-0"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M5 12H19M19 12L13 6M19 12L13 18"
                                stroke="#2E2E2E"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-[22px] pt-1.5 pb-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#DEDBD3] [&::-webkit-scrollbar-thumb]:rounded">
                    <h1 className="text-[20px] font-bold text-[#3B6B5E] text-right leading-[1.6] mt-1 mb-5">
                        شرایط، قوانین و بیانیه‌های حریم خصوصی
                    </h1>

                    <p className="text-[14.5px] text-[#4A4844] text-right leading-[2] mb-[22px]">
                        با نصب و استفاده از این اپلیکیشن نوویت، شما موافقت می‌کنید که:
                    </p>

                    <div className="mb-[22px]">
                        <h2 className="text-[15.5px] font-bold text-[#2E2E2E] text-right mb-2.5">
                            ثبت‌نام و اطلاعات شخصی
                        </h2>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                                <span className="text-[#9C998F] text-[14.5px] leading-[2] flex-shrink-0">–</span>
                                <p className="text-[14px] text-[#5C594F] leading-[2] text-right m-0">
                                    برای استفاده از خدمات، لازم است اطلاعات پایه مانند نام و شماره تماس خود را وارد کنید.
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-[#9C998F] text-[14.5px] leading-[2] flex-shrink-0">–</span>
                                <p className="text-[14px] text-[#5C594F] leading-[2] text-right m-0">
                                    مسئولیت صحت اطلاعات واردشده بر عهده شماست.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-[22px]">
                        <h2 className="text-[15.5px] font-bold text-[#2E2E2E] text-right mb-2.5">
                            استفاده از داده‌ها
                        </h2>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                                <span className="text-[#9C998F] text-[14.5px] leading-[2] flex-shrink-0">–</span>
                                <p className="text-[14px] text-[#5C594F] leading-[2] text-right m-0">
                                    داده‌های شما تنها برای مدیریت نوبت‌ها، اطلاع‌رسانی و بهبود کیفیت خدمات استفاده می‌شود.
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-[#9C998F] text-[14.5px] leading-[2] flex-shrink-0">–</span>
                                <p className="text-[14px] text-[#5C594F] leading-[2] text-right m-0">
                                    اطلاعات شخصی شما به هیچ شخص ثالثی فروخته یا اجاره داده نمی‌شود.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-[22px]">
                        <h2 className="text-[15.5px] font-bold text-[#2E2E2E] text-right mb-2.5">
                            امنیت و محرمانگی
                        </h2>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                                <span className="text-[#9C998F] text-[14.5px] leading-[2] flex-shrink-0">–</span>
                                <p className="text-[14px] text-[#5C594F] leading-[2] text-right m-0">
                                    اپلیکیشن از روش‌های امنیتی استاندارد برای حفاظت از داده‌های شما استفاده می‌کند.
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-[#9C998F] text-[14.5px] leading-[2] flex-shrink-0">–</span>
                                <p className="text-[14px] text-[#5C594F] leading-[2] text-right m-0">
                                    در صورت الزام قانونی، ممکن است اطلاعات شما در اختیار مراجع ذی‌صلاح قرار گیرد.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-[22px]">
                        <h2 className="text-[15.5px] font-bold text-[#2E2E2E] text-right mb-2.5">
                            به‌روزرسانی قوانین
                        </h2>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                                <span className="text-[#9C998F] text-[14.5px] leading-[2] flex-shrink-0">–</span>
                                <p className="text-[14px] text-[#5C594F] leading-[2] text-right m-0">
                                    شرایط و قوانین ممکن است در آینده تغییر کند و نسخه جدید در اپلیکیشن منتشر خواهد شد.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: 8 }} />
                </div>

                <div className="relative px-5 pt-[14px] pb-[max(env(safe-area-inset-bottom),18px)]">
                    <div className="absolute -top-[22px] left-0 right-0 h-[22px] bg-gradient-to-b from-[rgba(243,241,234,0)] to-[#F3F1EA] pointer-events-none" />
                    <button
                        type="button"
                        onClick={handleAccept}
                        className="w-full h-[52px] rounded-xl border-none bg-[#3B6B5E] text-white text-base font-semibold font-[inherit] cursor-pointer shadow-[0_2px_10px_rgba(59,107,94,0.25)] active:scale-[0.98] transition-all duration-150"
                    >
                        متوجه شدم
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsPrivacy;