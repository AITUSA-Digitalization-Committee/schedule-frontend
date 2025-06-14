
interface LoadingProps {
    className?: string
}

function Loading({ className }: LoadingProps) {
    return (
        <div className={`${className} flex justify-center items-center`}>
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
    );
}

export default Loading;