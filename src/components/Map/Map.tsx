import React, {useEffect, useState} from "react";
import {LatLngExpression} from "leaflet";
import {MapContainer, TileLayer, Marker, Tooltip, Polyline, WMSTileLayer, LayersControl, ImageOverlay,Popup} from "react-leaflet";
import {connect} from "react-redux";
import {setPlacePreviewVisibility, setSelectedPlace} from "../../store/actions";
import {IState, Place} from "../../store/models";
import AddMarker from "./AddMarker";

import "./Map.css";

const Map = ({
                 isVisible,
                 places,
                 selectedPlace,
                 togglePreview,
                 setPlaceForPreview,
             }: any) => {
    const defaultPosition: LatLngExpression = [-15.7757265,-48.0773024];
    const [polyLineProps, setPolyLineProps] = useState([]);

    useEffect(() => {
        setPolyLineProps(places.reduce((prev: LatLngExpression[], curr: Place) => {
            prev.push(curr.position);
            return prev;
        }, []))
    }, [places]);

    const showPreview = (place: Place) => {
        if (isVisible) {
            togglePreview(false);
            setPlaceForPreview(null);
        }

        if (selectedPlace?.title !== place.title) {
            setTimeout(() => {
                showPlace(place);
            }, 400);
        }
    };

    const showPlace = (place: Place) => {
        setPlaceForPreview(place);
        togglePreview(true);
    };

    return (
        <div className="map__container">
            <MapContainer
                center={defaultPosition}
                zoom={5}
                scrollWheelZoom={true}
                style={{height: "100vh"}}
                zoomControl={false}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.Overlay name="Fisiografia Brasil">
                        <WMSTileLayer
                            url="https://geoservicos.inde.gov.br/geoserver/DHN/ows?SERVICE=WMS&"
                            layers='FISIOGRAFIA_BRASIL2019'
                            format='image/png'
                            transparent={true}
                            opacity={1}
                        />
                    </LayersControl.Overlay>

                    <LayersControl.Overlay name="Modelo Digital do Terrreno">
                        <WMSTileLayer
                            url="https://geoservicos.inde.gov.br/geoserver/DHN/ows?SERVICE=WMS&"
                            layers='dem'
                            format='image/png'
                            transparent={true}
                            opacity={1}
                        />
                    </LayersControl.Overlay>


                </LayersControl>


            </MapContainer>
        </div>
    );
};

const mapStateToProps = (state: IState) => {
    const {places} = state;
    return {
        isVisible: places.placePreviewsIsVisible,
        places: places.places,
        selectedPlace: places.selectedPlace,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        togglePreview: (payload: boolean) =>
            dispatch(setPlacePreviewVisibility(payload)),
        setPlaceForPreview: (payload: Place) =>
            dispatch(setSelectedPlace(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
