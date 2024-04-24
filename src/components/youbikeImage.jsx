import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'

export function YouBikeImage({ src, style, alt }) {
    return (
        <img src={src} style={style} alt={alt} />
    )
}