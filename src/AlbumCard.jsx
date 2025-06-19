import { Card, CardBody, CardHeader, Image } from '@nextui-org/react'

const AlbumCard = ({ title, data }) => {
    console.log('AlbumCard props:', { title, data });
    return (
        <div>
            <Card isPressable>
                <CardHeader>
                    <h3>{title}</h3>
                </CardHeader>
                <CardBody>
                        {data.songs?.map((song) => (
                            <div key={song}>
                                {song}
                            </div>
                        ))}
                </CardBody>
            </Card>
        </div>
    )
}

export default AlbumCard