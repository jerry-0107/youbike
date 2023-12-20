import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'

export function YouBikeImage({ src, style, alt }) {
    return (
        <img src={src + "/?t=" + dayjs().format("sss")} style={style} alt={alt} />
    )
}