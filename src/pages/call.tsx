const Call = () => {
    const handlePhoneClick = () => {
        window.open('tel:+98468038909', '_self');
    };

    const handleEmailClick = () => {
        window.open('mailto:EB.NA.0078@gmail.com', '_self');
    };

    return (
        <div className="flex justify-center p-4 sm:p-6 lg:p-8">
            <div className="relative w-full max-w-[1560px] h-auto min-h-[760px] mx-auto backdrop-blur-[18px] backdrop-saturate-120 bg-gradient-to-b from-white/15 via-white/8 to-transparent border border-white/15 rounded-[25px] lg:rounded-[35px] shadow-[0_0_25px_rgba(255,255,255,0.06),inset_0_0_18px_rgba(255,255,255,0.08)] transition-all duration-500 flex flex-col items-center gap-8 opacity-100 py-8 sm:py-12">

                {/* افکت نور پس‌زمینه */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12), transparent 60%)", mixBlendMode: "overlay" }}></div>
                </div>

                {/* هدر اصلی */}
                <div className="relative z-10 w-full max-w-[1480px] text-center">
                    <h2 className="text-white font-shabnam-fd font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">تماس با ما</h2>
                </div>

                {/* بخش اطلاعات تماس */}
                <div className="relative z-10 w-full max-w-[1480px] flex flex-col lg:flex-row gap-8 lg:gap-16 px-4 sm:px-8 lg:px-20">

                    {/* سمت راست - اطلاعات تماس */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* شماره تماس */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-white font-shabnam-fd font-medium text-lg sm:text-xl lg:text-2xl">شماره تماس</h3>
                            <button
                                onClick={handlePhoneClick}
                                className="text-white font-shabnam-fd text-2xl sm:text-3xl lg:text-4xl font-light text-right direction-ltr hover:text-white/80 transition-all duration-300 cursor-pointer active:scale-95 select-all"
                            >
                              09354844680
                            </button>
                        </div>

                        {/* ایمیل */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-white font-shabnam-fd font-medium text-lg sm:text-xl lg:text-2xl">پست الکترونیکی</h3>
                            <button
                                onClick={handleEmailClick}
                                className="text-white font-shabnam-fd text-xl sm:text-2xl lg:text-3xl font-light text-right direction-ltr hover:text-white/80 transition-all duration-300 cursor-pointer active:scale-95 select-all"
                            >
                                EB.NA0078@gmail.com
                            </button>
                        </div>
                        {/* خط جداکننده */}
                        <div className="w-full h-px bg-white/15 my-4"></div>

                        {/* ساعات پاسخگویی */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white font-shabnam-fd font-bold text-xl sm:text-2xl lg:text-3xl">ساعات پاسخگویی</h3>
                            <p className="text-white/80 font-shabnam-fd text-base sm:text-lg lg:text-xl leading-relaxed">
                                ما در NOWait تلاش می‌کنیم تا در کوتاه‌ترین زمان ممکن پاسخگوی شما باشیم.
                            </p>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <h4 className="text-white font-shabnam-fd font-bold text-lg sm:text-xl mb-2">از شنبه تا چهارشنبه</h4>
                                <p className="text-white/80 font-shabnam-fd text-base sm:text-lg">9:۰۰ - 18:۰۰</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <h4 className="text-white font-shabnam-fd font-bold text-lg sm:text-xl mb-2">پنجشنبه</h4>
                                <p className="text-white/80 font-shabnam-fd text-base sm:text-lg">11:۰۰ - 13:۰۰</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-white font-shabnam-fd font-bold text-lg sm:text-xl mb-2">جمعه</h4>
                                <p className="text-white/60 font-shabnam-fd text-base sm:text-lg">تعطیل - عدم پاسخگویی</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* بخش پایینی - اطلاعات اضافی */}
                <div className="relative z-10 w-full max-w-[1480px] px-4 sm:px-8 lg:px-20 mt-8">
                    <div className="text-center">
                        <p className="text-white/70 font-shabnam-fd text-sm sm:text-base lg:text-lg">
                            برای ارتباط سریع‌تر با ما، می‌توانید از طریق ایمیل یا شماره تماس فوق اقدام نمایید.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Call;