import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/auth";

const OtpManager = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const phoneNumber = location.state?.phoneNumber || "";
    const codeLength = 6;
    const resendSeconds = 55;

    const [code, setCode] = useState("");
    const [seconds, setSeconds] = useState(resendSeconds);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (seconds <= 0) return;
        const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(t);
    }, [seconds]);

    useEffect(() => {
        if (!phoneNumber) {
            navigate("/login");
        }
    }, [phoneNumber, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = e.target.value.replace(/[^0-9]/g, "").slice(0, codeLength);
        setCode(digitsOnly);
        setError("");
    };

    const handleResend = useCallback(async () => {
        if (seconds > 0) return;

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("https://nowaitapp.ir/api/v1/accounts/auth/login/manager/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone: phoneNumber }),
            });

            const data = await response.json();

            if (response.status === 200) {
                console.log("OTP مجدد ارسال شد:", data);
                setSeconds(resendSeconds);
                setCode("");
                inputRef.current?.focus();
            } else {
                setError(data.message || "خطا در ارسال مجدد کد. لطفاً تلاش کنید.");
            }
        } catch (error) {
            console.error("خطا:", error);
            setError("مشکل در اتصال به سرور. لطفاً مجدد تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    }, [seconds, resendSeconds, phoneNumber]);

    const handleBack = () => {
        navigate("/login");
    };

    const handleConfirm = async () => {
        if (!isValid) return;

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("https://nowaitapp.ir/api/v1/accounts/auth/verify/manager/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                    code: code,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log("تایید موفق:", data);

                // ====== ذخیره توکن با AuthService ======
                const authService = AuthService;
                authService.setTokens({
                    access: data.access,
                    refresh: data.refresh,
                    expires_in: data.expires_in || 86400,
                    token_type: data.token_type || 'Bearer',
                });

                if (data.user && data.center) {
                    authService.setUserData(data.user, data.center);
                }

                localStorage.setItem('is_logged_in', 'true');
                // ======================================

                navigate("/profile");
            } else {
                setError(data.message || "کد تأیید اشتباه است. لطفاً مجدد تلاش کنید.");
            }
        } catch (error) {
            console.error("خطا:", error);
            setError("مشکل در اتصال به سرور. لطفاً مجدد تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    const isValid = code.length === codeLength;

    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");

    const displayPhone = toFarsiDigits(phoneNumber);

    return (
        <div dir="rtl" lang="fa" className="min-h-screen w-full flex justify-center bg-[#F3F1EA] font-[Vazirmatn]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap');
                * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
                html, body, #root { height: 100%; }
                button:active { transform: scale(0.98); }
                .otp-input { letter-spacing: 14px; }
                .otp-input::placeholder { color: #C7C4BB; letter-spacing: 14px; }
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

                <div className="flex-1 px-5 pt-5 pb-0">
                    <h1 className="text-[22px] font-bold text-[#3B6B5E] text-right leading-[1.6] m-0">
                        کد تأیید را وارد کنید
                    </h1>

                    <p className="text-[14.5px] text-[#5C594F] leading-[2] text-right mt-3.5">
                        کد تأیید با پیامک به شماره{" "}
                        <span className="text-[#2E2E2E] font-semibold">{displayPhone}</span> ارسال شد.
                    </p>

                    <p className="text-[13.5px] text-[#8A8780] text-right mt-1.5 mb-6">
                        شماره موبایل اشتباه است؟{" "}
                        <button
                            type="button"
                            onClick={handleBack}
                            className="text-[#E96B3A] text-[13.5px] font-medium bg-transparent border-none cursor-pointer font-[inherit]"
                        >
                            ویرایش
                        </button>
                    </p>

                    <div className="flex justify-center">
                        <input
                            ref={inputRef}
                            className="otp-input w-full h-[58px] rounded-xl border-[1.5px] border-[#BFD6CD] bg-white outline-none text-center text-[22px] font-semibold text-[#3B6B5E] font-[inherit]"
                            type="tel"
                            inputMode="numeric"
                            dir="ltr"
                            autoFocus
                            value={code}
                            onChange={handleChange}
                            maxLength={codeLength}
                            placeholder={"\u2013".repeat(codeLength)}
                            aria-label="کد تأیید"
                        />
                    </div>

                    {error && (
                        <div className="text-[#D64545] text-sm text-center mt-3">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-center mt-5">
                        {seconds > 0 ? (
                            <p className="text-[13px] text-[#8A8780] m-0">
                                فرصت ثبت کد تأیید تا {toFarsiDigits(mm)}:{toFarsiDigits(ss)}
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isLoading}
                                className="text-[13.5px] font-semibold text-[#E96B3A] bg-transparent border-none cursor-pointer font-[inherit] disabled:opacity-50"
                            >
                                {isLoading ? "در حال ارسال..." : "ارسال مجدد کد"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="px-5 pt-5 pb-1">
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!isValid || isLoading}
                        className={`w-full h-[52px] rounded-xl border-none text-base font-semibold font-[inherit] transition-all duration-150 active:scale-[0.98] ${(!isValid || isLoading) ? 'bg-[#DAD7CE] text-[#B3AFA4] cursor-not-allowed' : 'bg-[#3B6B5E] text-white cursor-pointer shadow-[0_2px_10px_rgba(59,107,94,0.25)]'}`}
                    >
                        {isLoading ? "در حال تأیید..." : "تأیید و ورود"}
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

export default OtpManager;