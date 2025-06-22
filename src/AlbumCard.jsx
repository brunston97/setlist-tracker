import { Card, CardBody, CardHeader } from '@nextui-org/react'

const AlbumCard = ({ title, data, counts }) => {
    return (
        <Card className="flex flex-col bg-zinc-500 p-5 " style={{ borderRadius: '1rem' }}>
            <CardHeader className="mb-4">
                <h2 className="text-xl text-white font-semibold">{title}</h2>
            </CardHeader>
            <CardBody>
                <img src={data.cover} className="mb-4"></img>
                <ul>
                    {data.songs?.map((song) => (
                        <li key={song} className="flex justify-between items-center py-1 text-white">
                            <span>{song}</span>
                            <span>{counts[song] ?? 0}</span>
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    )
}

export default AlbumCard