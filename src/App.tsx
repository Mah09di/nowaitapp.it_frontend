import { useEffect, useState, type ReactNode, type ComponentType } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- ایمپورت کامپوننت‌ها و صفحات ---
import GlassHeader from "./components/GlassHeader";
import Home from "./pages/Home";
import Dashboard from "./services/Dashboard";
import Settings from "./pages/information";
import Notifications from "./pages/call";
import Help from "./pages/Help";
import InstallPage from "./pages/InstallPage";
import LoginUsername from "./pages/LoginUsername";
import Register from "./pages/Register/Register";
import OtpManager from "./pages/OTP/otpmanager";
import TermsPrivacy from "./pages/about/Termsprivacy";
import { InstallPWA } from "./components/InstallPWA";
import "leaflet/dist/leaflet.css";

// نام کلیدی که توکن کاربر در localStorage ذخیره می‌شود
const TOKEN_KEY = "token";

// تابعی برای بررسی اینکه آیا کاربر لاگین کرده است یا خیر
const isLoggedIn = (): boolean => {
  try {
    return !!localStorage.getItem(TOKEN_KEY);
  } catch {
    return false;
  }
};

/* ==========================================
   ۱. محافظ‌های مسیر (Route Guards)
   ========================================== */

// هدایت هوشمند: اگر لاگین بود -> داشبورد، اگر نبود -> صفحه ورود
// (فعلاً در مسیر اصلی استفاده نشده، اما برای آینده آماده است)
const RootRedirect = () => (
  <Navigate to={isLoggedIn() ? "/home" : "/login"} replace />
);

// مسیر محافظت شده: اگر کاربر لاگین نکرده باشد، او را به صفحه ورود می‌فرستد
const ProtectedRoute = ({ children }: { children: ReactNode }) =>
  isLoggedIn() ? <>{children}</> : <Navigate to="/login" replace />;

// مسیر عمومی: اگر کاربر لاگین کرده باشد، اجازه نمی‌دهد صفحه ورود یا ثبت‌نام را ببیند
const PublicOnlyRoute = ({ children }: { children: ReactNode }) =>
  isLoggedIn() ? <Navigate to="/home" replace /> : <>{children}</>;

/* ==========================================
   ۲. قالب اصلی و مشترک سایت (Layout)
   ========================================== */

// این کامپوننت شامل پس‌زمینه، هدر (منو) و دکمه نصب PWA است
const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative flex flex-col min-h-screen text-white">
    {/* پس‌زمینه دسکتاپ */}
    <div className="absolute inset-0 bg-[#33635E] bg-[url('/assets/img/NOWait-bg.png')] bg-top bg-no-repeat bg-cover md:block hidden" />
    {/* پس‌زمینه موبایل */}
    <div className="absolute inset-0 bg-[#33635E] bg-[url('/assets/img/BackGround-NOWait-Mobile-1.png')] bg-top bg-no-repeat bg-cover block md:hidden" />

    {/* هدر ثابت در بالای صفحه */}
    <div className="fixed top-0 left-0 w-full z-50">
      <GlassHeader />
    </div>

    {/* محتوای اصلی صفحه */}
    <div className="relative flex-1 overflow-y-auto pt-[90px] md:pt-[120px] px-4 sm:px-6 lg:px-10 w-full mx-auto max-w-[1400px]">
      {children}
    </div>

    {/* دکمه نصب اپلیکیشن (PWA) */}
    <InstallPWA />
  </div>
);

// قالب همراه با چک کردن لاگین (برای آینده که بخوای امنیت رو فعال کنی)
const withLayout = (Page: ComponentType) => (
  <ProtectedRoute>
    <AppLayout>
      <Page />
    </AppLayout>
  </ProtectedRoute>
);

// 🔴 قالب بدون چک کردن لاگین (فعلاً برای تست و کار روی ظاهر استفاده می‌شود)
const withLayoutNoAuth = (Page: ComponentType) => (
  <AppLayout>
    <Page />
  </AppLayout>
);

/* ==========================================
   ۳. کامپوننت اصلی برنامه (App)
   ========================================== */

function App() {
  // استیتی برای بررسی اتصال اینترنت کاربر
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    updateStatus();

    // گوش دادن به رویدادهای آنلاین/آفلاین شدن مرورگر
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  // اگر کاربر اینترنت نداشت، صفحه قرمز هشدار را نشان بده
  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-600 text-white text-center px-6">
        <h1 className="text-3xl font-bold">📡 اینترنت شما قطع شد</h1>
        <p className="mt-2 text-white/80">لطفاً اتصال اینترنت خود را بررسی کنید</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="relative flex flex-col min-h-screen">
        <Routes>
          {/* =======================================================
              🟢 مسیر اصلی (Root)
              در حال حاضر به صورت موقت، صفحه Home را بدون نیاز به لاگین باز می‌کند.
              (برای فعال‌سازی لاگین در آینده، کافیست این خط را پاک کنی 
               و خط زیر آن را از کامنت دربیاوری)
          ======================================================= */}
          <Route path="/" element={withLayoutNoAuth(Home)} />
          {/* <Route path="/" element={<RootRedirect />} /> */}


          {/* =======================================================
              🌐 مسیرهای عمومی (بدون هدر و منو)
          ======================================================= */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginUsername />
              </PublicOnlyRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-code" element={<OtpManager />} />
          <Route path="/install" element={<InstallPage />} />
          <Route path="/about/Termsprivacy" element={<TermsPrivacy />} />

          {/* =======================================================
              🔒 مسیرهای داخلی برنامه (همراه با هدر)
              در حال حاضر برای راحتی کار تو، حالت NoAuth فعال است.
              (برای فعال‌سازی امنیت، باکس پایینی را کامنت کن و 
               باکس بالایی را از کامنت دربیاور)
          ======================================================= */}

          {/* حالت تست (بدون نیاز به لاگین): */}
          <Route path="/home" element={withLayoutNoAuth(Home)} />
          <Route path="/dashboard" element={withLayoutNoAuth(Dashboard)} />
          <Route path="/settings" element={withLayoutNoAuth(Settings)} />
          <Route path="/notifications" element={withLayoutNoAuth(Notifications)} />
          <Route path="/help" element={withLayoutNoAuth(Help)} />

          {/* حالت امن (نیاز به لاگین) - برای آینده: */}
          {/* 
          <Route path="/home" element={withLayout(Home)} />
          <Route path="/dashboard" element={withLayout(Dashboard)} />
          <Route path="/settings" element={withLayout(Settings)} />
          <Route path="/notifications" element={withLayout(Notifications)} />
          <Route path="/help" element={withLayout(Help)} />
          */}

          {/* =======================================================
              ❓ هر آدرس ناشناخته‌ای (404)
              اگر کاربر آدرسی را اشتباه وارد کرد، او را به صفحه اصلی می‌فرستیم.
          ======================================================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;