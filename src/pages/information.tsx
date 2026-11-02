const GlassBox = () => {
    const teamMembers = [
        {
            name: "محمد مکین",
            title: "Management / Android Developer / Producer",
            image: "/assets/img/Makin.png",
            description: "مسئول پیاده‌سازی اپلیکیشن Nowait، هدایت تیم و تصمیم‌گیری در مسیر تولید. با دقت بالا در جزئیات طرح و هماهنگی کامل تیم توسعه، رفتار اپلیکیشن و پلتفرم را دقیقاً مطابق نیاز تجربه کاربری راحت و سریع کاربران اجرا کرد."
        },
        {
            name: "مهدی هاشمی اصل",
            title: "BackEnd Developer / Security Operations Center",
            image: "/assets/img/Mah09di.png",
            description: "مسئول توسعه بک‌اند و امنیت زیرساخت، از طراحی اولیه تا اجرای نهایی. با ترکیب دقت فنی و نگاه سیستمی، هم سایت نویت را توسعه داد، هم امنیت تعاملات را تضمین کرد. مهره‌ای کلیدی در تکمیل پروژه، که تجربه‌ای سریع و مطمئن برای کاربران خلق کرد."
        },
        {
            name: "ابراهیم نصیری",
            title: "Product Designer",
            image: "/assets/img/nasi.png",
            description: "مسئول طراحی تجربه کاربری، رابط کاربری با دقت بالا در جزئیات محیطی پویا و زیبا برای کاربران خلق کرد"

        },
    ];

    return (
        <div className="flex flex-col items-center w-full gap-6 xs:gap-8 sm:gap-12 px-4 sm:px-6 lg:px-8">

            {/* GlassBox اصلی – شامل همه محتوا */}
            <div className="relative w-full max-w-[95vw] xs:max-w-[92vw] sm:max-w-[90vw] mx-auto p-4 xs:p-5 sm:p-8 lg:p-12 flex flex-col gap-6 xs:gap-8 sm:gap-12
                backdrop-blur-[18px] backdrop-saturate-120 bg-gradient-to-b from-white/20 via-white/10 to-transparent
                border border-white/20 rounded-[20px] xs:rounded-[25px] lg:rounded-[35px]
                shadow-[0_0_25px_rgba(255,255,255,0.08),inset_0_0_18px_rgba(255,255,255,0.1)]
                transition-all duration-500
            ">

                {/* بخش درباره ما */}
                <div className="flex flex-col gap-3 xs:gap-4 sm:gap-6">
                    <h2 className="text-white font-shabnam-fd font-medium text-[20px] xs:text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] text-right leading-[110%]">
                        درباره ما
                    </h2>
                    <p className="text-white font-shabnam-fd text-[12px] xs:text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px] leading-[165%] text-right">
                        ما یک تیم جوان، خلاق و پرانرژی هستیم که با عشق به تجربه‌های بهتر، Nowait را خلق کردیم.
                        NOWait اولین محصول ما، اما نه آخرین!
                        ایده‌ی Nowait از دل نیازهای واقعی کاربران و دغدغه‌های روزمره شکل گرفت: چطور میشه صف‌ها رو حذف کرد، تجربه‌ی انتظار رو دلپذیر کرد، و ارتباط بین کسب‌وکارها و مشتری‌ها رو ساده‌تر ساخت؟
                        ما از پس‌زمینه‌های مختلفی اومدیم — طراحی، توسعه، تجربه کاربری، و استراتژی محصول — اما یک چیز بین همه‌مون مشترکه و اون اشتیاق به ساختن ابزارهایی است که واقعاً به درد بخورن، ساده هستن، و لبخند روی لب کاربر میارن.
                        Nowait فقط یک اپ نیست؛ شروع یک مسیر جدیده برای ما.
                        ما باور داریم که با ترکیب تکنولوژی، طراحی هوشمند، و توجه به جزئیات، می‌تونیم تجربه‌های روزمره رو بهتر کنیم — صف‌ها رو کوتاه‌تر، ارتباط‌ها رو شفاف‌تر، و لحظه‌ها رو ارزشمندتر.
                        ممنونیم که با ما همراهید. این فقط آغاز راهه…
                    </p>
                </div>

                {/* بخش تیم - کارت‌های اعضای تیم */}
                <div className="flex flex-col gap-4 xs:gap-5 sm:gap-6">
                    <h2 className="text-white font-shabnam-fd font-medium text-[20px] xs:text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] text-right leading-[110%]">
                        تیم ما
                    </h2>
                    <h1>در ادامه با اعضای تیم ما بیشتر آشنا بشید — چهره‌هایی که با هم Nowait رو به واقعیت تبدیل کردن:</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8 lg:gap-10">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="flex flex-col items-center text-center w-full">
                                {/* عکس پروفایل */}
                                <div className="w-[120px] xs:w-[140px] sm:w-[160px] lg:w-[180px] xl:w-[200px] h-[120px] xs:h-[140px] sm:h-[160px] lg:h-[180px] xl:h-[200px] rounded-[35px] xs:rounded-[40px] sm:rounded-[45px] lg:rounded-[50px] overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                    <span className="text-white/50 text-[10px] xs:text-xs sm:text-sm hidden">
                                        تصویر پروفایل
                                    </span>
                                </div>

                                {/* نام */}
                                <h3 className="text-white font-shabnam-fd font-medium text-[14px] xs:text-[16px] sm:text-[18px] lg:text-[20px] mt-3 xs:mt-4">
                                    {member.name}
                                </h3>

                                {/* عنوان شغلی */}
                                <p className="text-white/70 font-shabnam-fd text-[11px] xs:text-[12px] sm:text-[13px] lg:text-[14px] mt-1">
                                    {member.title}
                                </p>

                                {/* کارت توضیحات */}
                                <div className="bg-white/10 backdrop-blur-[8px] rounded-[12px] xs:rounded-[14px] sm:rounded-[16px] mt-3 xs:mt-4 p-3 xs:p-4 sm:p-5 w-full">
                                    <p className="text-white font-shabnam-fd text-[11px] xs:text-[12px] sm:text-[13px] lg:text-[14px] leading-[165%] text-right">
                                        {member.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlassBox;