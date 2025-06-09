
const LoaingCenter = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-content items-center justify-center flex flex-col">
                <div className="flex flex-row gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
                </div>
                <p className="mt-2 text-lg">Loading...</p>
            </div>
        </div>
    );
}
export default LoaingCenter;