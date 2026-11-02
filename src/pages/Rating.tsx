import { useState } from "react";

const Rating = () => {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        console.log("امتیاز داده شده:", rating);
        setSubmitted(true);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-700 to-green-500 p-4">
            {!submitted ? (
                <>
                    <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6">
                        لطفاً امتیاز خود را ثبت کنید
                    </h1>

                    <div className="flex gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-4xl ${rating >= star ? "text-yellow-400" : "text-white/50"
                                    } transition-colors duration-300`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-white text-green-700 font-semibold rounded-lg hover:bg-white/90 transition-colors duration-200"
                    >
                        ثبت امتیاز
                    </button>
                </>
            ) : (
                <h2 className="text-white text-2xl sm:text-3xl font-bold">
                    با تشکر از امتیاز شما!
                </h2>
            )}
        </div>
    );
};

export default Rating;
