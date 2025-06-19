import { Card, CardBody, CardHeader, Image } from '@nextui-org/react'

const AlbumCard = ({ title, data, counts }) => {
    console.log('AlbumCard props:', { title, data });
    return (
        <Card isPressable className="flex flex-col">
            <CardHeader className="mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
            </CardHeader>
            <CardBody>
                <ul>
                    {data.songs?.map((song) => (
                        <li key={song} className="flex justify-between items-center py-1">
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