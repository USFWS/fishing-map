const L = require('leaflet');

const circleIcon = new L.Icon({
  iconSize: [12, 12],
  iconAnchor: [12, 12],
  popupAnchor: [1, -24],
  iconUrl: '../img/circle.svg'
});

module.exports = {
  circleIcon
};