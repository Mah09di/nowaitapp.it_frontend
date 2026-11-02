import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const [centerData, setCenterData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authService = AuthService;

        if (!authService.isAuthenticated()) {
            navigate("/login");
            return;
        }

        const user = authService.getUserData();
        const center = authService.getCenterData();

        if (user && center) {
            setUserData(user);
            setCenterData(center);
        }

        setIsLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        const authService = AuthService;
        authService.clearTokens();
        localStorage.removeItem('is_logged_in');
        navigate("/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F3F1EA]">
                <div className="text-center">
                    <div className="text-2xl">⏳</div>
                    <p className="text-[#3B6B5E] mt-2">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F3F1EA] p-6">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h1 className="text-2xl font-bold text-[#3B6B5E] text-center mb-6">
                        داشبورد کاربر
                    </h1>

                    {userData && (
                        <div className="space-y-4">
                            <div className="border-b pb-3">
                                <p className="text-sm text-gray-500">شماره موبایل</p>
                                <p className="text-lg font-semibold">{userData.phone}</p>
                            </div>
                            <div className="border-b pb-3">
                                <p className="text-sm text-gray-500">نوع کاربر</p>
                                <p className="text-lg font-semibold">
                                    {userData.is_center_manager ? 'مدیر مرکز' : 'کاربر عادی'}
                                </p>
                            </div>
                        </div>
                    )}

                    {centerData && (
                        <div className="mt-4 pt-4 border-t">
                            <h2 className="text-lg font-bold text-[#3B6B5E] mb-3">
                                اطلاعات مرکز
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">نام مرکز</p>
                                    <p className="font-semibold">{centerData.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">آدرس</p>
                                    <p className="font-semibold">{centerData.address}</p>
                                </div>
                                {centerData.latitude && centerData.longitude && (
                                    <div>
                                        <p className="text-sm text-gray-500">موقعیت</p>
                                        <p className="font-semibold">
                                            {centerData.latitude}, {centerData.longitude}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="w-full mt-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                    >
                        خروج از حساب
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;