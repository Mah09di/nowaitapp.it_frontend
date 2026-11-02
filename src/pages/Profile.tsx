import { useState, useEffect } from "react";
import "../styles/hourglass.css";

interface ApiData {
    position: number;
    avg_wait_seconds: number;
    status: string;
    center_name: string;
    center_address: string;
}

const Profile: React.FC = () => {
    const [apiData, setApiData] = useState<ApiData>({
        position: 0,
        avg_wait_seconds: 0,
        status: "waiting",
        center_name: "",
        center_address: "",
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [queueToken, setQueueToken] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [cancelStatus, setCancelStatus] = useState<string>("");
    const [hasValidToken, setHasValidToken] = useState<boolean>(true);
    
    const [rating, setRating] = useState<number>(0);
    const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
    const [isRatingMode, setIsRatingMode] = useState<boolean>(false);
    const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            setQueueToken(token);
            fetchAllDataWithToken(token);
        } else {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                fetchProfileData(accessToken);
            } else {
                setHasValidToken(false);
                setLoading(false);
            }
        }
    }, []);

    // آپدیت خودکار هر 10 ثانیه
    useEffect(() => {
        if (!queueToken) return;
        const interval = setInterval(() => {
            fetchQueueStatus(queueToken);
        }, 10000);
        return () => clearInterval(interval);
    }, [queueToken]);

    // دریافت وضعیت صف
    const fetchQueueStatus = async (token: string) => {
        try {
            const response = await fetch(`https://nowaitapp.ir/api/v1/public/queue/${token}/stats/`);
            if (response.ok) {
                const data = await response.json();
                setApiData(prev => ({
                    ...prev,
                    position: data.position || 0,
                    status: data.status || "waiting",
                    avg_wait_seconds: data.avg_wait_seconds || prev.avg_wait_seconds,
                }));
                setHasValidToken(true);

                // اگر وضعیت done شد و هنوز امتیاز ثبت نشده، حالت امتیازدهی فعال شود
                if (data.status === "done" && !ratingSubmitted) {
                    setIsRatingMode(true);
                }
            } else if (response.status === 404) {
                // توکن معتبر نیست یا منقضی شده
                setHasValidToken(false);
                setLoading(false);
            }
        } catch (err) {
            console.error('Error fetching queue status:', err);
            setHasValidToken(false);
            setLoading(false);
        }
    };

    // دریافت اطلاعات با access_token
    const fetchProfileData = async (accessToken: string): Promise<void> => {
        try {
            setLoading(true);

            const centerResponse = await fetch('https://nowaitapp.ir/api/v1/centers/', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (!centerResponse.ok) {
                setApiData(prev => ({
                    ...prev,
                    center_name: "مرکز درمانی نور",
                    center_address: "تهران، خیابان ولیعصر، نبش خیابان شهید بهشتی"
                }));
                setLoading(false);
                return;
            }

            const centerData = await centerResponse.json();
            const centerId = centerData.id || centerData.user;

            let statsData: any = {};
            if (centerId) {
                const statsResponse = await fetch(`https://nowaitapp.ir/api/v1/queue/${centerId}/stats/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                if (statsResponse.ok) {
                    statsData = await statsResponse.json();
                }
            }

            setApiData({
                position: apiData.position,
                avg_wait_seconds: statsData.avg_wait_seconds || centerData.avg_wait_seconds || 0,
                status: apiData.status,
                center_name: centerData.name || "مرکز درمانی نور",
                center_address: centerData.address || "تهران، خیابان ولیعصر، نبش خیابان شهید بهشتی",
            });
            setHasValidToken(true);

        } catch (err) {
            console.error('Error fetching profile data:', err);
        } finally {
            setLoading(false);
        }
    };

    // دریافت همه اطلاعات با queue_token
    const fetchAllDataWithToken = async (token: string) => {
        try {
            setLoading(true);

            const statsResponse = await fetch(`https://nowaitapp.ir/api/v1/public/queue/${token}/stats/`);
            if (!statsResponse.ok) {
                if (statsResponse.status === 404) {
                    setHasValidToken(false);
                    setLoading(false);
                    return;
                }
                throw new Error("خطا در دریافت وضعیت صف");
            }

            const statsData = await statsResponse.json();
            console.log('📊 Stats Data:', statsData);

            setApiData({
                position: statsData.position || 0,
                avg_wait_seconds: statsData.avg_wait_seconds || 0,
                status: statsData.status || "waiting",
                center_name: statsData.center_name || "مرکز درمانی نور",
                center_address: statsData.center_address || "آدرسی ثبت نشده",
            });
            setHasValidToken(true);

            // اگر وضعیت done شد و هنوز امتیاز ثبت نشده، حالت امتیازدهی فعال شود
            if (statsData.status === "done" && !ratingSubmitted) {
                setIsRatingMode(true);
            }

        } catch (err) {
            console.error('❌ Error:', err);
            setHasValidToken(false);
        } finally {
            setLoading(false);
        }
    };

    // لغو نوبت
    const handleCancelQueue = async () => {
        if (!queueToken) {
            setError("توکن نوبت یافت نشد");
            return;
        }

        setIsCancelling(true);
        setCancelStatus("در حال لغو نوبت...");

        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                setCancelStatus("❌ لطفاً ابتدا وارد شوید");
                setIsCancelling(false);
                setTimeout(() => {
                    window.location.href = 'https://nowaitapp.ir/';
                }, 2000);
                return;
            }

            const queueResponse = await fetch(`https://nowaitapp.ir/api/v1/public/queue/${queueToken}/stats/`);
            if (!queueResponse.ok) throw new Error("نوبت یافت نشد");
            const queueData = await queueResponse.json();

            if (queueData.status === "waiting" || queueData.status === "in_progress") {

                const centerResponse = await fetch('https://nowaitapp.ir/api/v1/centers/', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                if (centerResponse.status === 401) {
                    localStorage.removeItem('access_token');
                    setCancelStatus("❌ نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
                    setIsCancelling(false);
                    setTimeout(() => {
                        window.location.href = 'https://nowaitapp.ir/';
                    }, 2000);
                    return;
                }

                if (!centerResponse.ok) throw new Error("مرکز یافت نشد");
                const centerData = await centerResponse.json();
                const centerId = centerData.id || centerData.user;

                const queueListResponse = await fetch(`https://nowaitapp.ir/api/v1/queue/${centerId}/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                if (!queueListResponse.ok) throw new Error("خطا در دریافت لیست صف");
                const queueList = await queueListResponse.json();

                const queueItem = queueList.find((item: any) => item.position === queueData.position);
                if (!queueItem) throw new Error("آیتم صف یافت نشد");

                const deleteResponse = await fetch(`https://nowaitapp.ir/api/v1/queue/${queueItem.id}/delete`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                if (deleteResponse.ok) {
                    setCancelStatus("✅ نوبت با موفقیت لغو شد");
                    setApiData(prev => ({ ...prev, status: "cancelled" }));
                    setShowCancelModal(false);
                    if (queueToken) fetchQueueStatus(queueToken);
                    setTimeout(() => setCancelStatus(""), 3000);
                } else {
                    const errorData = await deleteResponse.json();
                    throw new Error(errorData.detail || "خطا در لغو نوبت");
                }
            } else {
                throw new Error("این نوبت قابل لغو نیست");
            }
        } catch (err: any) {
            console.error('Error cancelling queue:', err);
            setCancelStatus(`❌ ${err.message || "خطا در لغو نوبت"}`);
            setTimeout(() => setCancelStatus(""), 4000);
        } finally {
            setIsCancelling(false);
        }
    };

    const handleCancelModal = (): void => setShowCancelModal(false);
    const handleCancelAction = (): void => setShowCancelModal(true);

    // ثبت امتیاز
    const handleRatingSubmit = async () => {
        if (rating === 0) {
            alert("لطفاً یک امتیاز انتخاب کنید");
            return;
        }

        setIsSubmittingRating(true);

        try {
            const response = await fetch('https://nowaitapp.ir/api/v1/public/queue/rate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: queueToken,
                    score: rating
                })
            });

            const data = await response.json();

            if (response.ok) {
                setRatingSubmitted(true);
                setIsRatingMode(false);
                alert("✅ امتیاز شما با موفقیت ثبت شد!");
                console.log('Rating saved:', data);
            } else {
                alert(`❌ ${data.detail || "خطا در ثبت امتیاز"}`);
            }
        } catch (err) {
            console.error('Error submitting rating:', err);
            alert("❌ خطا در ارتباط با سرور");
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const getStatusMessage = () => {
        switch (apiData.status) {
            case "in_progress":
                return {
                    main: "🎉 حالا نوبت شماست!",
                    sub: "لطفاً در اولین فرصت به مرکز مربوطه مراجعه نمایید.",
                    color: "text-green-400"
                };
            case "cancelled":
                return {
                    main: "نوبت لغو شده",
                    sub: "نوبت شما لغو شد",
                    color: "text-red-400"
                };
            case "done":
                return {
                    main: "✅ نوبت تکمیل شد",
                    sub: "خدمات با موفقیت ارائه شد",
                    color: "text-blue-400"
                };
            case "pending_cancellation":
                return {
                    main: "در انتظار تأیید لغو",
                    sub: "درخواست لغو برای منشی ارسال شد",
                    color: "text-yellow-400"
                };
            case "waiting":
            default:
                return {
                    main: `نفر ${apiData.position} در صف انتظار هستید`,
                    sub: `متوسط زمان پاسخگویی به هر نفر تا این لحظه ${Math.ceil(apiData.avg_wait_seconds / 60)} دقیقه`,
                    color: "text-yellow-400"
                };
        }
    };

    const statusMessage = getStatusMessage();

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4" dir="rtl">
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 max-w-md text-center">
                    <p className="text-red-400 text-lg">{error}</p>
                    <button onClick={() => window.location.href = '/'} className="mt-4 px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                        بازگشت به صفحه اصلی
                    </button>
                </div>
            </div>
        );
    }

    // اگر توکن معتبر نباشد، صفحه پیام "هیچ نوبت فعالی ندارید" نمایش داده می‌شود
    if (!hasValidToken && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-8" dir="rtl">
                <div className="w-full max-w-[1600px] mx-auto flex flex-col xl:flex-row justify-center items-stretch gap-6 xl:gap-12 2xl:gap-20">
                    {/* Main Box */}
                    <div className="relative flex flex-col items-center justify-center text-center backdrop-blur-[20px] backdrop-saturate-150 bg-gradient-to-br from-white/15 via-white/8 to-transparent border border-white/15 rounded-[35px] shadow-[0_8px_40px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] w-full flex-1 max-w-[950px] min-h-[400px] xl:min-h-[725px] p-6 md:p-8 xl:p-10">
                        <div className="absolute inset-0 pointer-events-none rounded-[35px] overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-gradient-to-b from-white/10 via-transparent to-transparent" />
                        </div>
                        <div className="relative z-10 flex flex-col items-center justify-center w-full gap-4">
                            <div className="text-6xl mb-2">📭</div>
                            <h2 className="text-white text-2xl sm:text-3xl xl:text-4xl font-bold">
                                هیچ نوبت فعالی ندارید
                            </h2>
                            <p className="text-white/60 text-sm sm:text-base xl:text-lg">
                                لطفاً برای دریافت نوبت به مرکز مورد نظر مراجعه کنید.
                            </p>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="mt-4 px-8 py-3 rounded-full bg-white text-[#83647B] font-medium hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                            >
                                بازگشت به صفحه اصلی
                            </button>
                        </div>
                    </div>

                    {/* Side Box - با همان استایل خالی */}
                    <div className="relative flex flex-col backdrop-blur-[20px] backdrop-saturate-150 bg-gradient-to-br from-white/15 via-white/8 to-transparent border border-white/15 rounded-[35px] shadow-[0_8px_40px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] w-full max-w-[560px] flex-shrink-0 min-h-[300px] xl:min-h-[725px] p-6 md:p-8 xl:p-10">
                        <div className="absolute inset-0 pointer-events-none rounded-[35px] overflow-hidden">
                            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-white/10 via-transparent to-transparent" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-center items-center">
                            <p className="text-white/30 text-sm sm:text-base">‌</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-8" dir="rtl">
            <div className="w-full max-w-[1600px] mx-auto flex flex-col xl:flex-row justify-center items-stretch gap-6 xl:gap-12 2xl:gap-20">

                {/* Main Box */}
                <div className="relative flex flex-col items-center justify-center text-center backdrop-blur-[20px] backdrop-saturate-150 bg-gradient-to-br from-white/15 via-white/8 to-transparent border border-white/15 rounded-[35px] shadow-[0_8px_40px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] w-full flex-1 max-w-[950px] min-h-[400px] xl:min-h-[725px] p-6 md:p-8 xl:p-10">
                    <div className="absolute inset-0 pointer-events-none rounded-[35px] overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-gradient-to-b from-white/10 via-transparent to-transparent" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center w-full gap-4 xl:gap-[28px]">
                        {loading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-14 w-14 border-4 border-white/20 border-t-white mb-4"></div>
                                <p className="text-white/60 text-base">در حال دریافت اطلاعات...</p>
                            </div>
                        ) : isRatingMode && !ratingSubmitted ? (
                            <div className="flex flex-col items-center w-full">
                                <h2 className="text-white text-xl sm:text-2xl xl:text-3xl font-bold mb-4">
                                    لطفاً امتیاز خود را ثبت کنید
                                </h2>

                                <p className="text-white/70 text-sm sm:text-base mb-4">
                                    از خدمات ما چقدر راضی بودید؟
                                </p>

                                <div className="flex gap-2 sm:gap-3 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`text-4xl sm:text-5xl xl:text-6xl transition-colors duration-300 hover:scale-110 ${rating >= star ? "text-yellow-400" : "text-white/30"
                                                }`}
                                            disabled={isSubmittingRating}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>

                                <p className="text-white/50 text-xs sm:text-sm mb-4">
                                    {rating === 1 && "خیلی ضعیف"}
                                    {rating === 2 && "ضعیف"}
                                    {rating === 3 && "متوسط"}
                                    {rating === 4 && "خوب"}
                                    {rating === 5 && "عالی"}
                                </p>

                                <button
                                    onClick={handleRatingSubmit}
                                    disabled={isSubmittingRating}
                                    className="mt-2 px-8 sm:px-12 py-2.5 sm:py-3.5 rounded-full bg-white text-[#83647B] font-medium text-sm sm:text-base xl:text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmittingRating ? "در حال ثبت..." : "ثبت امتیاز"}
                                </button>
                            </div>
                        ) : ratingSubmitted ? (
                            <div className="flex flex-col items-center">
                                <div className="text-6xl mb-4">✅</div>
                                <h2 className="text-white text-2xl sm:text-3xl xl:text-4xl font-bold">
                                    با تشکر از امتیاز شما!
                                </h2>
                                <p className="text-white/70 text-sm sm:text-base mt-2">
                                    امتیاز شما با موفقیت ثبت شد
                                </p>
                            </div>
                        ) : (
                            <>
                                {apiData.status === "waiting" ? (
                                    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                                        <p className={`text-2xl sm:text-3xl xl:text-[40px] font-bold text-white mb-1 leading-tight ${statusMessage.color}`}>
                                            {statusMessage.main}
                                        </p>
                                        <span className="inline-flex items-center justify-center flex-shrink-0">
                                            <div className="hourglass">
                                                <div className="top"></div>
                                                <div className="bottom"></div>
                                            </div>
                                        </span>
                                    </div>
                                ) : (
                                    <p className={`text-2xl sm:text-3xl xl:text-[40px] font-bold text-white mb-1 leading-tight ${statusMessage.color}`}>
                                        {statusMessage.main}
                                    </p>
                                )}

                                <p className="text-white text-base sm:text-lg xl:text-xl font-medium">
                                    {statusMessage.sub}
                                </p>

                                {apiData.status === "waiting" && apiData.position > 0 && (
                                    <div className="mt-1 xl:mt-2 px-3 py-1 sm:px-5 sm:py-1.5 bg-white/10 rounded-full border border-white/10">
                                        <p className="text-white/70 text-xs sm:text-sm xl:text-base">
                                            زمان تقریبی: {Math.ceil(apiData.position * (apiData.avg_wait_seconds / 60))} دقیقه
                                        </p>
                                    </div>
                                )}

                                {cancelStatus && (
                                    <div className={`mt-2 px-4 py-2 rounded-lg text-sm ${cancelStatus.includes("✅") ? "bg-green-500/20 text-green-300" :
                                        cancelStatus.includes("❌") ? "bg-red-500/20 text-red-300" :
                                            "bg-yellow-500/20 text-yellow-300"
                                        }`}>
                                        {cancelStatus}
                                    </div>
                                )}

                                {(apiData.status === "waiting" || apiData.status === "in_progress") && (
                                    <button
                                        onClick={handleCancelAction}
                                        disabled={isCancelling}
                                        className="mt-4 xl:mt-6 w-full max-w-[320px] sm:max-w-[400px] xl:max-w-[850px] h-[50px] xl:h-[67px] rounded-full bg-white text-[#83647B] font-medium text-sm sm:text-base xl:text-lg hover:bg-gray-100 hover:scale-[1.02] transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center px-6"
                                    >
                                        {isCancelling ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin h-4 w-4 xl:h-5 xl:w-5 border-2 border-[#83647B] border-t-transparent rounded-full"></span>
                                                در حال لغو...
                                            </span>
                                        ) : (
                                            "لغو نوبت"
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Side Box */}
                <div className="relative flex flex-col backdrop-blur-[20px] backdrop-saturate-150 bg-gradient-to-br from-white/15 via-white/8 to-transparent border border-white/15 rounded-[35px] shadow-[0_8px_40px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] w-full max-w-[560px] flex-shrink-0 min-h-[300px] xl:min-h-[725px] p-6 md:p-8 xl:p-10">
                    <div className="absolute inset-0 pointer-events-none rounded-[35px] overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-white/10 via-transparent to-transparent" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-center">
                        <h2 className="text-right text-white/80 text-base sm:text-lg xl:text-2xl font-medium mb-4 xl:mb-6">
                            جزئیات محل مراجعه
                        </h2>

                        <div className="space-y-4 xl:space-y-5 text-white/90">
                            <div className="p-3 xl:p-4 bg-white/5 rounded-xl border border-white/10 hover:border-green-500/30 transition">
                                <p className="text-white/50 text-xs sm:text-sm xl:text-base mb-1">مرکز مراجع :</p>
                                <p className="font-bold text-white text-xs sm:text-sm xl:text-base text-right leading-relaxed">
                                    {apiData.center_name || "مرکز درمانی نور"}
                                </p>
                            </div>

                            <div className="p-3 xl:p-4 bg-white/5 rounded-xl border border-white/10 hover:border-green-500/30 transition">
                                <p className="text-white/50 text-xs sm:text-sm xl:text-base mb-1">آدرس :</p>
                                <p className="text-white text-xs sm:text-sm xl:text-base text-right leading-relaxed">
                                    {apiData.center_address || "آدرسی ثبت نشده"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* مودال لغو نوبت */}
            {showCancelModal && (
                <>
                    <div className="fixed inset-0 backdrop-blur-xl bg-black/40 z-50" onClick={handleCancelModal}></div>
                    <div
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[92%] max-w-[420px]"
                        style={{
                            borderRadius: "28px",
                            background: "rgba(20, 20, 30, 0.95)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
                        }}
                        dir="rtl"
                    >
                        <div className="flex flex-col items-center justify-center p-6 sm:p-8 gap-4 sm:gap-6">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                                    <span className="text-3xl sm:text-4xl">!</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-white text-lg sm:text-xl font-bold mb-1">لغو نوبت</p>
                                    <p className="text-white/50 text-sm sm:text-base">
                                        آیا از لغو نوبت خود اطمینان دارید؟
                                    </p>
                                    {apiData.position > 0 && (
                                        <p className="text-white/40 text-xs sm:text-sm mt-2">
                                            شما نفر {apiData.position} در صف هستید
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 w-full mt-2">
                                <button
                                    onClick={handleCancelModal}
                                    className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 transition text-sm sm:text-base font-medium"
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={handleCancelQueue}
                                    disabled={isCancelling}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition shadow-[0_4px_20px_rgba(239,68,68,0.3)] disabled:opacity-50 text-sm sm:text-base font-medium"
                                >
                                    {isCancelling ? "در حال لغو..." : "لغو نوبت"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;