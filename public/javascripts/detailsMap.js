maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: attraction["geometry"]["coordinates"], // starting position [lng, lat]
  zoom: 14, // starting zoom
});

const marker = new maptilersdk.Marker()
  .setLngLat(attraction["geometry"]["coordinates"])
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h2>${attraction.name}</h2><p>${attraction.location}</p>`
    )
  )
  .addTo(map);
