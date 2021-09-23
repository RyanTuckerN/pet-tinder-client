const calcKm = ([lat1, lon1, lat2, lon2]) =>
    {
      const R = 6371; // km
      const dLat = toRad(lat2-lat1);
      const dLon = toRad(lon2-lon1);
      lat1 = toRad(lat1);
      lat2 = toRad(lat2);

      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      return Math.round(R * c);
    }

    const kmToMiles = km => km/1.609
    const calcMiles = r => Math.round(kmToMiles(calcKm(r)))
    const toRad = value => value * Math.PI / 180

export default { calcMiles, calcKm }