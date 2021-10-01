import React, {useEffect, useRef, useState} from 'react';
import ArcGIGMap from "@arcgis/core/Map";
import MapView from '@arcgis/core/views/MapView';
import GraphicLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import './map.css';

const MapComponent = () => {
    const mapRef = useRef();
    let mapView = null;
    let graphicsLayerSketch = null;

    useEffect(() => {
        const map = new ArcGIGMap({
            basemap: 'gray-vector'
        })

        mapView = new MapView({
            container: mapRef.current,
            map: map,
            center: [-88.79499397277833, 13.7153719325982],
            //center: [-118.80500, 34.0270  0],
            zoom: 9
        });

        graphicsLayerSketch = new GraphicLayer();
        map.add(graphicsLayerSketch);

        const sketch = new Sketch({
            layer: graphicsLayerSketch,
            view: mapView,
            creationMode: "update" // Auto-select
        });

        mapView.ui.add(sketch, "top-right");

        sketch.on("update", (event) => {
            if (event.state === "start") {
                makeSpatialQuery(event.graphics[0].geometry);
                console.log(event.graphics);
            }

            if (event.state === "complete") {
                graphicsLayerSketch.remove(event.graphics[0]); // Clear the graphic when a user clicks off of it or sketches new one
            }

            if (event.toolEventInfo && (event.toolEventInfo.type === "scale-stop" || event.toolEventInfo.type === "reshape-stop" || event.toolEventInfo.type === "move-stop")) {
                makeSpatialQuery(event.graphics[0].geometry);
            }
        })

        mapView.on("click", e => {

        })
        return () => mapView && mapView.destroy();

    }, [])

    const makeSpatialQuery = (geometry) => {
        const layer = new FeatureLayer({
            url: "https://services3.arcgis.com/mivYpjRW1Gcq9sPC/arcgis/rest/services/cuencas_2/FeatureServer/0"
        })
        const parcelQuery = {
            spatialRelationship: "intersects", // Relationship operation to apply
            geometry: geometry,  // The sketch feature geometry
            outFields: ["OBJECTID"], // Attributes to return
            returnGeometry: true
        };

        layer.queryFeatures(parcelQuery)
            .then((results) => {

                displayResult(results)

            }).catch((error) => {
            console.log(error);
        });
    }

    const displayResult = (results) => {

        const symbol = {
            type: "simple-fill",
            color: [20, 130, 200, 0.5],
            outline: {
                color: "white",
                width: .5
            },
        };

        const popupTemplate = {
            title: "{Nombre_Rio}",
            content: "Esta cuenta tiene un codigo de: {Pfastetter}"
        };

        results.features.map((feature) => {
            feature.symbol = symbol;
            feature.popupTemplate = popupTemplate;
            return feature;
        });

        // Clear display
        mapView.popup.close();
        mapView.graphics.removeAll();
        // Add features to graphics layer
        mapView.graphics.addMany(results.features);
    }

    return (
        <div>
            <div className="row">
                <div className="mapcss" ref={mapRef}/>
            </div>
        </div>
    );
}

export default MapComponent;
