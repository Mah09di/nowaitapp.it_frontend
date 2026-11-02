import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const phoneNumber = location.state?.phoneNumber || "";

    const [centerName, setCenterName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [nameFocused, setNameFocused] = useState(false);
    const [addressFocused, setAddressFocused] = useState(false);
    const [descFocused, setDescFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const isValid = centerName.trim().length > 0 && address.trim().length > 0;

    const handleBack = () => {
        navigate("/login");
    };

    const handleSubmit = async () => {
        if (!isValid) return;

        setIsLoading(true);
        setError("");

        const payload: any = {
            phone: phoneNumber,
            center_name: centerName,
            address: address,
        };

        if (description.trim()) {
            payload.description = description;
        }

        try {
            const response = await fetch("https://nowaitapp.ir/api/v1/accounts/auth/register/manager/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.status === 201) {
                console.log("ثبت‌نام موفق:", data);
                navigate("/verify-code", { state: { phoneNumber: phoneNumber } });
            } else if (response.status === 400) {
                setError(data.message || data.detail || "خطای اعتبارسنجی. لطفاً اطلاعات را بررسی کنید.");
            } else if (response.status === 500) {
                setError("خطای سرور. لطفاً مجدد تلاش کنید.");
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

    if (!phoneNumber) {
        navigate("/login");
        return null;
    }

    return (
        <div dir="rtl" lang="fa" className="min-h-screen w-full flex justify-center bg-[#F3F1EA] font-[Vazirmatn]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap');
                * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
                html, body, #root { height: 100%; }
                button:active { transform: scale(0.98); }
                textarea::placeholder, input::placeholder { color: #B9B6AE; opacity: 1; }
            `}</style>

            <div className="w-full max-w-[480px] min-h-screen bg-[#F3F1EA] flex flex-col pt-[env(safe-area-inset-top)] pb-[max(env(safe-area-inset-bottom),16px)]">

                <div className="flex justify-start items-center px-5 py-2">
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

                <div className="flex-1 px-5 pt-4 pb-0">
                    <h1 className="text-[22px] font-bold text-[#2E2E2E] text-right leading-[1.6] m-0">
                        ثبت‌نام مدیر
                    </h1>
                    <p className="text-[14.5px] text-[#6B6862] leading-[1.9] text-right mt-2.5 mb-[22px]">
                        برای ثبت‌نام اطلاعات مرکز خود را تکمیل نمایید.
                    </p>

                    <div className="h-[52px] rounded-xl border-[1.5px] border-[#C6D9D0] bg-[#E9EFE9] flex items-center px-4 mb-6">
                        <span className="text-[14.5px] text-[#4A5B54] font-medium">
                            شماره همراه: {toFarsiDigits(phoneNumber)}
                        </span>
                    </div>

                    <div className="mb-4">
                        <div className={`relative border-[1.5px] rounded-xl bg-[#F3F1EA] transition-colors duration-150 ${nameFocused ? 'border-[#3B6B5E]' : 'border-[#DEDBD3]'}`}>
                            <span className="absolute -top-2.5 right-3.5 bg-[#F3F1EA] px-1.5 text-xs text-[#8A8780]">
                                نام مرکز <span className="text-[#D64545] mr-0.5">*</span>
                            </span>
                            <input
                                type="text"
                                dir="rtl"
                                value={centerName}
                                onChange={(e) => setCenterName(e.target.value)}
                                onFocus={() => setNameFocused(true)}
                                onBlur={() => setNameFocused(false)}
                                placeholder="مثلاً: نُووِیت"
                                className="w-full h-[52px] bg-transparent border-none outline-none px-4 text-[15px] text-[#2E2E2E] font-[inherit] text-right"
                                aria-label="نام مرکز"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className={`relative border-[1.5px] rounded-xl bg-[#F3F1EA] transition-colors duration-150 min-h-[96px] ${addressFocused ? 'border-[#3B6B5E]' : 'border-[#DEDBD3]'}`}>
                            <span className="absolute -top-2.5 right-3.5 bg-[#F3F1EA] px-1.5 text-xs text-[#8A8780]">
                                نشانی مرکز <span className="text-[#D64545] mr-0.5">*</span>
                            </span>
                            <textarea
                                dir="rtl"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onFocus={() => setAddressFocused(true)}
                                onBlur={() => setAddressFocused(false)}
                                placeholder="مثلاً: میدان تجریش، خیابان سعد آباد، پلاک ۱۲"
                                className="w-full min-h-[96px] bg-transparent border-none outline-none p-4 text-[15px] text-[#2E2E2E] font-[inherit] text-right resize-none leading-[1.8]"
                                rows={3}
                                aria-label="نشانی مرکز"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className={`relative border-[1.5px] rounded-xl bg-[#F3F1EA] transition-colors duration-150 ${descFocused ? 'border-[#3B6B5E]' : 'border-[#DEDBD3]'}`}>
                            <span className="absolute -top-2.5 right-3.5 bg-[#F3F1EA] px-1.5 text-xs text-[#8A8780]">
                                توضیحات (اختیاری)
                            </span>
                            <textarea
                                dir="rtl"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onFocus={() => setDescFocused(true)}
                                onBlur={() => setDescFocused(false)}
                                placeholder="توضیحات درباره مرکز خود را وارد کنید (اختیاری)"
                                className="w-full min-h-[80px] bg-transparent border-none outline-none p-4 text-[15px] text-[#2E2E2E] font-[inherit] text-right resize-none leading-[1.8]"
                                rows={2}
                                aria-label="توضیحات"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-[#D64545] text-sm text-right mb-3">
                            {error}
                        </div>
                    )}

                    <p className="text-[12.5px] text-[#D64545] text-right leading-[1.9] mt-2.5 mr-0.5">
                        این آدرس به مراجعه کنندگان ارائه می‌شود.
                    </p>
                </div>

                <div className="px-5 pt-5 pb-1">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isValid || isLoading}
                        className={`w-full h-[52px] rounded-xl border-none text-base font-semibold font-[inherit] transition-all duration-150 active:scale-[0.98] ${(!isValid || isLoading) ? 'bg-[#DAD7CE] text-[#B3AFA4] cursor-not-allowed' : 'bg-[#3B6B5E] text-white cursor-pointer shadow-[0_2px_10px_rgba(59,107,94,0.25)]'}`}
                    >
                        {isLoading ? "در حال ثبت..." : "ثبت‌نام"}
                    </button>
                </div>
            </div>
        </div>
    );
};

function toFarsiDigits(input: string): string {
    const fa = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return String(input).replace(/[0-9]/g, (d) => fa[parseInt(d)]);
}

export default Register;