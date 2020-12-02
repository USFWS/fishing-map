const L = require('leaflet');
const leafletKnn = require('leaflet-knn');
const _ = { map: require('lodash.map') };
const axios = require('axios');
require('leaflet-control-geocoder');
require('es6-promise').polyfill();
require('classlist-polyfill');


const layers = require('./layers');
const icons = require('./icons');
const emitter = require('./mediator');
const Disclaimer = require('./disclaimer');
const templates = require('./templates');

const results = document.querySelector('.map-results');
const fullExtent = document.querySelector('.full-extent');
const nearMe = document.querySelector('.near-me');

const USA = [[52.787078, -129.074974], [22.440945, -67.15689]];

new Disclaimer({
  container: document.querySelector('.map-disclaimer'),
  checkbox: document.querySelector('#dont-show-again'),
  close: document.querySelector('.map-close')
});

let data, markers, map, index;

const customizeIcon = (feat, latlng) =>
  L.marker(latlng, {
    icon: icons.circleIcon,
    alt: 'Circle icon representing a hunting opprotunity on a National Wildlife Refuge'
  });

const enablePopup = (feat, layer) => {
  layer.bindPopup(`<strong>${feat.properties.OrgName}</strong>`);
  layer.on('click', e => results.innerHTML = templates.displayOffice(e.target.feature.properties));
};

const createMap = response => {
  if (response.status >= 400) console.log('Bad response from the server');
  const fishing = response.data.features.filter(r => r.properties.FishingOpen === 'yes');
  data = { ...response.data, features: fishing };
  map = L.map('map', { scrollWheelZoom: false });
  index = leafletKnn(L.geoJSON(data));

  layers.basemap.addTo(map);
  _.map(layers.features, layer => layer.addTo(map));

  markers = L.geoJSON(data, {
    pointToLayer: customizeIcon,
    onEachFeature: enablePopup
  }).addTo(map);

  map.fitBounds(USA);

  L.Control.geocoder({
    defaultMarkGeocode: false,
    placeholder: "Zoom to a location...",
    collapsed: false
  })
    .on('markgeocode', e => onLocationFound({ latlng: e.geocode.center }))
    .addTo(map);

  map.on('locationfound', onLocationFound);
};

const getBounds = nearestFishingOpportunities => {
  return nearestFishingOpportunities.reduce((bounds, opportunity) => {
    return bounds.extend([opportunity.lat, opportunity.lon]);
  }, new L.latLngBounds());
};

const onLocationFound = e => {
  nearMe.querySelector('svg').classList.remove('loading');
  const nearestOpportunities = index.nearest(e.latlng, 10);
  results.innerHTML = templates.nearestFishingTable(nearestOpportunities, e.latlng);
  map.flyToBounds(getBounds(nearestOpportunities));
};

const getLocation = () => {
  nearMe.querySelector('svg').classList.add('loading');
  map.locate();
};

const zoomToFullExtent = () => map.flyToBounds(USA);

// Event Listeners
nearMe.addEventListener('click', getLocation);
fullExtent.addEventListener('click', zoomToFullExtent);
emitter.on('userlocation', location => console.log(location));

// OLD URL https://services.arcgis.com/QVENGdaPbd4LUkLV/arcgis/rest/services/USFWS_HQ_Fishing_Opportunities/FeatureServer

axios
  .get('https://services.arcgis.com/QVENGdaPbd4LUkLV/ArcGIS/rest/services/FWS_National_Hunting_and_Fishing_Opportunities_2020_2021/FeatureServer/0/query?where=objectId+%3E+0&outFields=*&returnGeometry=true&f=pgeojson')
  .then(createMap)
  .catch(console.log);
