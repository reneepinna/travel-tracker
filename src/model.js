const dayjs = require('dayjs');

export function getUserTrips(trips, userID) {
  return trips.filter(trip => trip.userID === userID)
}

export function sortTripGroup(trips) {
  const today = dayjs();

  return trips.reduce(
    (groups, trip) => {
      const tripDate = dayjs(trip.date, 'YYYY/MM/DD');

      if (tripDate.isBefore(today)) {
        groups.pastGroup.push(trip);
      } else if (trip.status === 'approved') {
        groups.upcomingGroup.push(trip);
      } else {
        groups.pendingGroup.push(trip);
      }

      return groups;
    },
    {
      pastGroup: [],
      pendingGroup: [],
      upcomingGroup: [],
    },
  );
}
