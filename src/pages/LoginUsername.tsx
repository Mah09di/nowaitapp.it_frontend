import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginUsername = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [focused, setFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
        setPhone(digitsOnly);
        setError("");
    };

    const isValid = /^09\d{9}$/.test(phone);

    const handleSubmit = async () => {
        if (!isValid) return;

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("https://nowaitapp.ir/api/v1/accounts/auth/login/manager/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone: phone }),
            });

            const data = await response.json();

            if (response.status === 200) {
                console.log("OTP ارسال شد:", data);
                navigate("/verify-code", { state: { phoneNumber: phone } });
            } else if (response.status === 202) {
                console.log("کاربر یافت نشد، رفتن به صفحه ثبت‌نام");
                navigate("/register", { state: { phoneNumber: phone } });
            } else if (response.status === 400) {
                setError(data.message || "شماره تلفن نامعتبر است. لطفاً مجدد تلاش کنید.");
            } else {
                setError(data.message || data.detail || "خطایی رخ داد. لطفاً مجدد تلاش کنید.");
            }
        } catch (error) {
            console.error("خطا:", error);
            setError("مشکل در اتصال به سرور. لطفاً مجدد تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div dir="rtl" lang="fa" className="min-h-screen w-full flex justify-center bg-[#F3F1EA] font-[Vazirmatn]">
            <div className="w-full max-w-[480px] min-h-screen bg-[#F3F1EA] flex flex-col pt-[max(env(safe-area-inset-top),14px)] pb-[max(env(safe-area-inset-bottom),16px)]">

                <div className="flex justify-start items-center px-5 py-2 border-b border-[#E4E1D8]">
                    <span className="text-sm text-[#3A3A3A] font-medium">English</span>
                </div>

                <div className="flex-1 px-5 pt-7">
                    <div className="text-right mb-7">
                        <h1 className="text-2xl font-bold text-[#3B6B5E]">خوش آمدید!</h1>
                        <p className="text-sm text-[#6B6862] mt-2.5 leading-relaxed">
                            برای ورود شماره همراه خود را وارد نمایید.
                        </p>
                    </div>

                    <div className="mb-3.5">
                        <div className={`relative border-[1.5px] rounded-xl bg-[#F3F1EA] transition-colors duration-150 ${focused ? 'border-[#3B6B5E]' : 'border-[#DEDBD3]'}`}>
                            <span className="absolute -top-2.5 right-3.5 bg-[#F3F1EA] px-1.5 text-xs text-[#8A8780]">
                                شماره موبایل
                            </span>
                            <input
                                type="tel"
                                inputMode="numeric"
                                dir="rtl"
                                value={phone}
                                onChange={handlePhoneChange}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                placeholder="مثلاً: ۰۹۱۲۳۴۵۶۷۸۹"
                                className="w-full h-[52px] bg-transparent border-none outline-none px-4 text-[15px] text-[#2E2E2E] font-[inherit] text-right"
                                aria-label="شماره موبایل"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-right mb-3">
                            {error}
                        </div>
                    )}

                    <p className="text-xs text-[#8A8780] leading-relaxed text-right">
                        با ثبت‌نام در نوویت،{" "}
                        <a href="/about/Termsprivacy" className="text-[#E96B3A] no-underline font-medium hover:opacity-80 transition-opacity">
                            شرایط، قوانین
                        </a>{" "}
                        و {" "}
                        <a href="/about/Termsprivacy" className="text-[#E96B3A] no-underline font-medium hover:opacity-80 transition-opacity">
                            بیانیه حریم خصوصی
                        </a>
                        را قبول می‌کنم.
                    </p>
                </div>

                <div className="px-5 pt-5 pb-1">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isValid || isLoading}
                        className={`w-full h-[52px] rounded-xl border-none bg-[#3B6B5E] text-white text-base font-semibold font-[inherit] cursor-pointer transition-all duration-150 active:scale-[0.98] ${(!isValid || isLoading) ? 'opacity-50' : 'opacity-100'}`}
                    >
                        {isLoading ? "در حال ارسال..." : "ورود"}
                    </button>
                </div>

                <div className="text-center px-5 py-3">
                    <Link to="/" className="text-sm text-[#8A8780] hover:text-[#3B6B5E] transition-colors">
                        ← بازگشت به صفحه اصلی
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginUsername;