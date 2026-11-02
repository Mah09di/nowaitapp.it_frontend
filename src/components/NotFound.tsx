import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-4">صفحه‌ای که دنبال آن هستید پیدا نشد!</p>
            <Link to="/" className="text-blue-500 underline">بازگشت به خانه</Link>
        </div>
    );
};

export default NotFound;
