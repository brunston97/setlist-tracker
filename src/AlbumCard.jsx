import { Card, CardBody, CardHeader } from '@nextui-org/react'

const AlbumCard = ({ title, data, counts }) => {
    return (
        <Card className="flex flex-col bg-zinc-500 p-5 " style={{ borderRadius: '1rem' }}>
            <CardHeader className="mb-4 h-12 flex items-center justify-center text-center">
                <h2 className="text-xl text-white font-semibold leading-tight">{title}</h2>
            </CardHeader>
            <CardBody>
                <img src={data.cover} className="mb-4"></img>
                <ul className="max-h-[25rem] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {data.songs?.map((song) => (
                        <li key={song} className="flex justify-between items-start gap-2 py-1 text-white">
                            <span className="flex-1 break-words text-left">{song}</span>
                            <span className="flex-shrink-0 text-right">{counts[song] ?? 0}</span>
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    )
}

export default AlbumCard