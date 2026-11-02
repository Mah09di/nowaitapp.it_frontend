import { useEffect } from "react";

const Home = () => {
    const fetchData = async () => {
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="flex flex-col lg:flex-row justify-between gap-6 px-4 sm:px-6 py-6 max-w-[1400px] mx-auto">

                <div className="flex flex-col gap-6 w-full lg:w-[65%]">

                    {/* باکس دانلود اپلیکیشن */}
                    <div className="relative flex flex-col items-center justify-center text-center backdrop-blur-[18px] backdrop-saturate-120 bg-gradient-to-b from-white/20 via-white/10 to-transparent border border-white/20 rounded-[25px] lg:rounded-[35px] shadow-[0_0_25px_rgba(255,255,255,0.08),inset_0_0_18px_rgba(255,255,255,0.1)] overflow-hidden transition-all duration-500 min-h-[200px] sm:min-h-[250px] p-6 sm:p-8 lg:p-10">
                        <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-5">
                            <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">
                                دانلود اپلیکیشن
                            </h2>

                            <p className="text-white/70 text-sm sm:text-base lg:text-lg font-medium">
                                «ویژه صاحبان کسب‌وکار و ارائه دهندگان خدمات»
                            </p>

                            <a
                                href="https://nowaitapp.ir/download"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[400px] h-[50px] sm:h-[55px] lg:h-[60px] rounded-full bg-white text-[#33635E] font-bold text-sm sm:text-base lg:text-lg hover:bg-gray-100 hover:scale-[1.02] transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.25)] flex items-center justify-center px-6"
                            >
                                دریافت آخرین نسخه
                            </a>
                        </div>
                    </div>

                    <div className="relative flex flex-col text-right backdrop-blur-[18px] backdrop-saturate-120 bg-gradient-to-b from-white/20 via-white/10 to-transparent border border-white/20 rounded-[25px] lg:rounded-[35px] shadow-[0_0_25px_rgba(255,255,255,0.08),inset_0_0_18px_rgba(255,255,255,0.1)] overflow-hidden transition-all duration-500 min-h-[300px] sm:min-h-[250px] p-3 sm:p-4 lg:p-6">
                        <img
                            src="/assets/img/mbilr.png"
                            alt="mobile_h2"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>

                {/* باکس سمت راست - محتوای معرفی */}
                <div className="relative flex flex-col text-right backdrop-blur-[18px] backdrop-saturate-120 bg-gradient-to-b from-white/20 via-white/10 to-transparent border border-white/20 rounded-[25px] lg:rounded-[35px] shadow-[0_0_25px_rgba(255,255,255,0.08),inset_0_0_18px_rgba(255,255,255,0.1)] overflow-hidden transition-all duration-500 w-full lg:w-[100%] min-h-[220px] sm:min-h-[250px] lg:min-h-[680px] xl:min-h-[640px] p-6 sm:p-8 lg:p-10">
                    <div className="relative z-10 w-full max-w-[720px] mx-auto flex flex-col items-center justify-center h-full text-center gap-5 px-2 lg:px-6">
                        {/* عنوان با فونت شبنم */}
                        <h1
                            className="text-white text-2xl sm:text-3xl lg:text-[2.4rem] xl:text-[2.8rem] font-bold leading-[1.5]"
                            style={{ fontFamily: "Shabnam FD, sans-serif" }}
                        >
                            Nowait رو همین حالا دریافت کن!
                        </h1>

                        {/* زیرنویس */}
                        <p className="text-white text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl leading-8">
                            مدیریت صف و نوبت‌دهی را هوشمند، سریع و بدون دردسر تجربه کنید.
                        </p>

                        <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-3xl leading-8">
                            این اپلیکیشن برای صاحبان کسب‌وکار و ارائه‌دهندگان خدمات طراحی شده تا ارتباط با مشتریان ساده‌تر، شفاف‌تر و مؤثرتر شود.
                        </p>

                        {/* لیست مزایا - راست‌چین با • */}
                        <div className="flex flex-col gap-1 mt-2 w-full max-w-3xl text-right">
                            <div className="text-white/90 text-sm sm:text-base lg:text-lg leading-8">
                                • کاهش ازدحام و انتظار
                            </div>
                            <div className="text-white/90 text-sm sm:text-base lg:text-lg leading-8">
                                • اطلاع‌رسانی لحظه‌ای به مشتریان
                            </div>
                            <div className="text-white/90 text-sm sm:text-base lg:text-lg leading-8">
                                • کنترل کامل از سمت مدیر یا پذیرش
                            </div>
                            <div className="text-white/90 text-sm sm:text-base lg:text-lg leading-8">
                                • مناسب برای رستوران‌ها، کلینیک‌ها، سالن‌ها، دفاتر خدماتی و هر کسب‌وکاری که با نوبت سروکار دارد.
                            </div>
                        </div>

                        {/* توضیحات تیم */}
                        <p className="text-white/70 text-xs sm:text-sm lg:text-base max-w-3xl leading-8 mt-1">
                            Nowait اولین محصول یک تیم جوان و متخصص است که با دقت بالا و شناخت نیازهای واقعی شما طراحی شده.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;