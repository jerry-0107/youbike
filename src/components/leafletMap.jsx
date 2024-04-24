import * as React from 'react';

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from "leaflet";

export function LeafletMap({ center, style, zoom, scrollWheelZoom, onClickCallBack, setRef, markers }) {
    const mapref = React.useRef()

    function getIconByColor(color) {

        return (
            new L.Icon({
                iconUrl:
                    `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            })
        )

    }

    React.useEffect(() => {
        if (typeof setRef === "function") {
            setRef(mapref)
        }
    }, [mapref])



    function MapEvents({ onClick }) {
        useMapEvents({
            click(e) {
                onClick(e)
            }
        })
        return false;
    };

    return (
        <>
            <MapContainer
                ref={mapref}
                dragging={!L.Browser.mobile}
                scrollWheelZoom={scrollWheelZoom}
                center={center}
                zoom={zoom}
                style={{ width: "100%", height: "35vh", ...style }}
            >
                <TileLayer
                    attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors${L.Browser.mobile ? "<br/>使用兩指移動與縮放地圖" : ""}`}
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {markers.map((d, i) => {
                    return (
                        <Marker
                            key={"marker-" + i}
                            position={d.position}
                            icon={getIconByColor(d.iconColor)}
                        >
                            <Popup>{d.popup}</Popup>
                        </Marker>
                    )
                })}


                {typeof (onClickCallBack) === "function" ? <MapEvents onClick={onClickCallBack} /> : <></>}

            </MapContainer>



        </>
    )
}
