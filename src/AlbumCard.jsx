import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { NormalizeSongTitle } from './utils/stringExtensions';
import ShowList from './ShowList'

const AlbumCard = ({ title, albumData, songs, shows }) => {

    const listRef = useRef(null);
    const [isScrollable, setIsScrollable] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const [expandedSong, setExpandedSong] = useState(null);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        const checkScrollable = () => {
            setIsScrollable(el.scrollHeight > el.clientHeight);
        };

        const checkIfAtBottomOrTop = () => {
            checkIfAtTop();
            checkIfAtBottom();
        };

        const checkIfAtTop = () => {
            setIsAtTop(el.scrollTop === 0);
        };

        const checkIfAtBottom = () => {
            setIsAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
        };

        checkScrollable();
        checkIfAtBottomOrTop();

        el.addEventListener("scroll", checkIfAtBottomOrTop);

        return () => {
            el.removeEventListener("scroll", checkIfAtBottomOrTop);
        };
    }, [albumData.songs]);

    const toggleSong = (song) => {
        const key = NormalizeSongTitle(song);

        setExpandedSong(prev =>
            prev === key ? null : key
        );
    };

    return (
        <Card className="flex flex-col bg-zinc-500 p-5" style={{ borderRadius: '1rem' }}>
            <CardHeader className="mb-4 h-12 flex items-center justify-center text-center">
                <h2 className="text-xl text-white font-semibold leading-tight">
                    {title}
                </h2>
            </CardHeader>

            <CardBody>
                <img src={albumData.cover} className="mb-4" />

                <div className="relative">
                    <ul
                        ref={listRef}
                        className="max-h-[25rem] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                    >
                        {albumData.songs?.map((song) => {
                            const key = NormalizeSongTitle(song);
                            const songData = songs[key];
                            const hasSeenSong = songData?.count > 0;
                            const isExpanded = expandedSong === key;

                            return (
                                <li key={song} className="py-1">
                                    {/* Song row */}
                                    <div
                                        onClick={() => hasSeenSong && toggleSong(song)}
                                        className={`flex justify-between items-start gap-2 ${
                                            hasSeenSong
                                                ? 'text-green-400 cursor-pointer'
                                                : 'text-white'
                                        }`}
                                    >
                                        <span className="flex-1 break-words text-left">
                                            {song}
                                        </span>

                                        <span className="flex-shrink-0 text-right">
                                            {songData?.count ?? 0}
                                        </span>
                                    </div>

                                    {/* Show list */}
                                    {isExpanded && 
                                        <ShowList
                                            showIds={songData.shows}
                                            shows={shows}
                                        />}
                                </li>
                            );
                        })}
                    </ul>

                    {isScrollable && (
                        <>
                            {!isAtBottom && (
                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-500 to-transparent"></div>
                            )}

                            {!isAtTop && (
                                <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-t from-transparent to-zinc-500"></div>
                            )}
                        </>
                    )}
                </div>
            </CardBody>
        </Card>
    )
}

export default AlbumCard