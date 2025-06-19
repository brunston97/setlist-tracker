import { Card, CardBody, CardHeader, CardProps, Image } from '@nextui-org/react'

const AlbumCard = (title) => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <h3>{title}</h3>
                </CardHeader>
                <CardBody>
                    <h4>tbd</h4>
                </CardBody>
            </Card>
        </div>
    )
}

export default AlbumCard