import { useEffect, useState } from 'react';

import { cn } from '@/util/utils';

interface MapProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    location: string
}

function MapContainer({ open, setOpen, location }: MapProps) {
    const [loading, setLoading] = useState(true);
    const [iframeKey, setIframeKey] = useState(0);

    useEffect(() => {
        if (open) {
            setLoading(true);
            // Обновляем ключ при изменении локации, чтобы пересоздать iframe
            setIframeKey(prev => prev + 1);
        }
    }, [open, location]);

    const src = `https://map.yeunikey.dev?location=${location}`;

    return (
        <div className='fixed z-50'>
            <div className={cn("fixed inset-0 bg-black/40",
                open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
                "transition-all duration-200"
            )} onClick={() => setOpen(false)} />

            <div className={cn("fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg h-96 overflow-hidden",
                open ? 'translate-y-0' : 'translate-y-full',
                "transition-all duration-300"
            )}>
                <div className="absolute top-0 mt-1 flex w-full justify-center z-10">
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
                </div>

                {/* Лоадер */}
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                )}

                <iframe
                    key={iframeKey}
                    src={src}
                    width="100%"
                    height="100%"
                    onLoad={() => setLoading(false)}
                    className="relative z-0"
                ></iframe>
            </div>
        </div>
    );
}

export default MapContainer;
