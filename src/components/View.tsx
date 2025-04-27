import { ReactNode } from "react";

interface ViewProps {
    className?: string,
    children?: ReactNode
}

function View({ className, children }: ViewProps) {
    return (
        <div className={`min-h-dvh min-w-dvw w-dvw flex flex-col ${className}`}>
            {children}
        </div>
    );
}

export default View;