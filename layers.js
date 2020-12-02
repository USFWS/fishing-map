const L = require('leaflet');
const esri = require('esri-leaflet');
const titlecase = require('title-case');

const refugeStyles = {
  color: 'green',
  weight: 3,
  opacity: 0.7
};

const onEachFeature = (feat, layer) => {
  const refuge = titlecase(feat.properties.ORGNAME);
  layer.bindPopup(`<strong>${refuge}</strong>`);
};

const basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
  maxZoom: 16
});

const features = {
  refuges: esri.featureLayer({
    url:
      'https://services.arcgis.com/QVENGdaPbd4LUkLV/arcgis/rest/services/National_Wildlife_Refuge_System_Boundaries/FeatureServer/0',
    attribution: 'U.S. Fish and Wildlife Service',
    onEachFeature: onEachFeature,
    minZoom: 7
  }),
};

module.exports.basemap = basemap;
module.exports.features = features;
