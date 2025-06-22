import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'

const AlbumCard = ({ title, data, counts }) => {

    const listRef = useRef(null);
    const [isScrollable, setIsScrollable] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        const checkIfAtBottom = () => {
            setIsAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
        };

        const checkScrollable = () => {
            setIsScrollable(el.scrollHeight > el.clientHeight);
            checkIfAtBottom();
        };
        
        checkScrollable();

        el.addEventListener("scroll", checkIfAtBottom);
        return () => removeEventListener("scroll", checkIfAtBottom);
    }, [data.songs]);

    return (
        <Card className="flex flex-col bg-zinc-500 p-5 " style={{ borderRadius: '1rem' }}>
            <CardHeader className="mb-4 h-12 flex items-center justify-center text-center">
                <h2 className="text-xl text-white font-semibold leading-tight">{title}</h2>
            </CardHeader>
            <CardBody>
                <img src={data.cover} className="mb-4"></img>
                <div className="relative">
                    <ul ref={listRef} className="max-h-[25rem] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {data.songs?.map((song) => (
                            <li key={song} className="flex justify-between items-start gap-2 py-1 text-white">
                                <span className="flex-1 break-words text-left">{song}</span>
                                <span className="flex-shrink-0 text-right">{counts[song] ?? 0}</span>
                            </li>
                        ))}
                    </ul>

                    {isScrollable && !isAtBottom && (
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-500 to-transparent"></div>
                    )}
                </div>
                
            </CardBody>
        </Card>
    )
}

export default AlbumCard