import * as Dialog from '@radix-ui/react-dialog';

interface MapProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    location: string
}

function MapContainer({ open, setOpen, location }: MapProps) {
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />

                <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg h-96 overflow-hidden">
                    <div className="absolute top-0 mt-1 flex w-full justify-center">
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
                    </div>

                    <iframe src={"https://map.yeunikey.dev?location=" + location} width={'100%'} height={'100%'}></iframe>

                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default MapContainer;