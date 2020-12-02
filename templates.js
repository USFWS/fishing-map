const distance = require('@turf/distance');

const displayOffice = props => {
  const description = props.DescFish ? props.DescFish : '';
  const name = props.UrlStation ?
    `<h2><a href="${props.UrlStation}" target="_blank">${props.OrgName}</a></h2>` :
    `<h2>${props.OrgName}</h2>`;
  return `
    ${name}
    <p>${description}</p>
    <p><a href="${props.UrlFishing}" target="_blank">Learn more about fishing opportunities at ${props.OrgName}</a>.</p>
  `;
};

const nearestFishingTable = (opportunities, coords) => {
  return `
    <h3>Nearby fishing opportunities</h3>
    <table>
      <thead>
        <tr>
          <th>Refuge</th>
          <th>Distance (mi)</th>
        </tr>
      </thead>
      <tbody>
        ${opportunities.map(f => {
    const props = f.layer.feature.properties;
    const toPoint = [f.lon, f.lat];
    const fromPoint = [coords.lng, coords.lat];
    const miles = distance(fromPoint, toPoint, { units: 'miles' });
    return `
            <tr>
              <td>
                <a href="${props.UrlFishing}" target='_blank'>
                  ${props.OrgName}
                </a>
              </td>
              <td>${miles.toFixed(0)}</td>
            </tr>`;
  }).join('')}
      </tbody>
    </table>
  `;
};

module.exports = {
  displayOffice,
  nearestFishingTable
};