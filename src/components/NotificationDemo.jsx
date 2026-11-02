import { useEffect, useState } from "react";

const OfflineDemo = () => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const updateStatus = () => {
            setIsOnline(navigator.onLine);
        };

        updateStatus();

        window.addEventListener("online", updateStatus);
        window.addEventListener("offline", updateStatus);

        return () => {
            window.removeEventListener("online", updateStatus);
            window.removeEventListener("offline", updateStatus);
        };
    }, []);

    if (!isOnline) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-600 text-white gap-4">
                <h1 className="text-3xl font-bold">📡 اینترنت قطع شد</h1>
                <p className="text-white/80">
                    لطفاً اتصال اینترنت خود را بررسی کنید
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-[#33635E]">
            <h1 className="text-white text-3xl font-bold">
                برنامه آنلاین است ✅
            </h1>

            <p className="text-white/70 text-sm">
                اینترنت شما وصل است
            </p>
        </div>
    );
};

export default OfflineDemo;