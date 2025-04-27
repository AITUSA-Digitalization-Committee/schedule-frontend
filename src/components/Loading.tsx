
interface LoadingProps {
    className?: string
}

function Loading({ className }: LoadingProps) {
    return (
        <div className={`${className} flex justify-center items-center`}>
            <div className="w-8 h-8 border-primary border-4 rounded-full border-t-transparent animate-spin" />
        </div>
    );
}

export default Loading;