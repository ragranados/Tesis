import './map.css';

import React, {useEffect, useRef, useState} from 'react';
import {createSqlQuery, getLastYearInfo, tableFormatting} from "../../utils";

import ArcGIGMap from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicLayer from '@arcgis/core/layers/GraphicsLayer';
import MapView from '@arcgis/core/views/MapView';
import Sketch from "@arcgis/core/widgets/Sketch";
import Table from '../ProjectsTable';

const MapComponent = () => {
    const mapRef = useRef();
    let mapView = null;
    let graphicsLayerSketch = null;
    let layer = new FeatureLayer({
        url: "https://services3.arcgis.com/mivYpjRW1Gcq9sPC/arcgis/rest/services/cuencas_con_estadistica_y_geometrias_corregidas_area_volumen_calculados/FeatureServer/0"
    });
    let projectsLayer = new FeatureLayer({
        url: "https://services3.arcgis.com/mivYpjRW1Gcq9sPC/arcgis/rest/services/capa_proyectos_consumo_anual/FeatureServer/0"
    });

    const [projects, setProjectsInfo] = useState([]);
    const [loadingProjects, setLoadingProjectsInfo] = useState(false);
    const [cuenca, setCuenca] = useState(null);
    const [balance, setBalance] = useState(null);

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
                clearInfo();
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

    useEffect(() => {
        calculateBalance();
    }, [projects]);

    const makeSpatialQuery = (geometry) => {

        const parcelQuery = {
            spatialRelationship: "intersects", // Relationship operation to apply
            geometry: geometry,  // The sketch feature geometry
            outFields: ["OBJECTID", "Pfastetter", "volumen_m3"], // Attributes to return
            returnGeometry: true
        };

        layer.queryFeatures(parcelQuery)
            .then((results) => {


                console.log('cuenca', results.features[0]);
                setCuenca(results.features[0]);

                queryTributary(results.features[0].attributes.Pfastetter);

                queryProjects(results.features[0].geometry);

            }).catch((error) => {
            console.log(error);
        });
    }

    const queryProjects = (geometry) => {

        setLoadingProjectsInfo(true);

        const projectQuery = {
            spatialRelationship: "intersects", // Relationship operation to apply
            geometry: geometry,  // The sketch feature geometry
            outFields: ["anio", "dga", "consumo_anual_m3"], // Attributes to return
            returnGeometry: true
        };

        projectsLayer.queryFeatures(projectQuery)
            .then((results) => {

                let test = getLastYearInfo(results);

                displayResultProjects(test);
            }).catch((error) => {
            console.log(error);
        });
    }

    const queryTributary = (results) => {

        const parcelQuery = {
            where: createSqlQuery(results),  // Set by select element
            spatialRelationship: "intersects", // Relationship operation to apply
            geometry: mapView.extent, // Restricted to visible extent of the map
            outFields: ["OBJECTID", "Pfastetter", "volumen_m3"], // Attributes to return
            returnGeometry: true
        };

        layer.queryFeatures(parcelQuery)
            .then((resultsTributary) => {

                displayResult(resultsTributary);

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

    const displayResultProjects = (results) => {

        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40],  // Orange
            outline: {
                color: [255, 255, 255], // White
                width: 0.5
            }
        };

        /*const popupTemplate = {
            title: "{Nombre_Rio}",
            content: "Esta cuenta tiene un codigo de: {Pfastetter}"
        };*/

        results.features.map((feature) => {

            feature.symbol = simpleMarkerSymbol;
            //feature.popupTemplate = popupTemplate;
            return feature;
        });
        mapView.graphics.addMany(results.features);

        setProjectsInfo(tableFormatting(results.features));

        setLoadingProjectsInfo(false);
    }

    const calculateBalance = () => {
        if (projects && cuenca) {

            let consumoProyectos = 0;

            projects.forEach((e) => {
                consumoProyectos = consumoProyectos + e.consumo_anual_m3;
            }, this);

            consumoProyectos = Math.round(consumoProyectos);

            setBalance({
                volumen_cuenca: Math.round(cuenca.attributes.volumen_m3),
                consumoProyectos,
                anual: Math.round(cuenca.attributes.volumen_m3 - consumoProyectos)
            })
        }
    }

    const clearInfo = () => {
        mapView.popup.close();
        mapView.graphics.removeAll();

        setProjectsInfo([]);
    }

    return (
        <div className="container mx-auto">
            
            
                <div className="row justify-center">
                    
                    <div className="mapcss" ref={mapRef}/>
                    <div className="bg-white overflow-hidden shadow-x1 sm:rounded-lg">
                    <table className="table-fixed ">
                        <tr>
                            <th className="py-4 h-10 bg-bgmarn text-textmarn">Volumen Cuenca (m3):</th>
                            <td className="p-3 flex justify-center">{!balance ? "" : balance.volumen_cuenca}</td>
                        </tr>
                        <tr>
                            <th className="py-4 w-28 h-10 bg-bgmarn text-textmarn">Consumo proyectos (m3):</th>
                            <td className="p-3 flex justify-center">{!balance ? "" : balance.consumoProyectos}</td>
                        </tr>
                        <tr>
                            <th className="py-4 h-10 bg-bgmarn text-textmarn">Balance Anual (m3):</th>
                            <td className="p-3 flex justify-center">{!balance ? "" : balance.anual}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <Table projects={projects} loading={loadingProjects}/>
            
        </div>
    );
}

export default MapComponent;
