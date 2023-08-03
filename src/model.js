const dayjs = require('dayjs');

export function getUserTrips(trips, userID) {
  return trips.filter(trip => trip.userID === userID);
}

export function getUserDestinations(destinations, userTrips) {
  return userTrips.map(trip => {
      return destinations.find(destination => trip.destinationID === destination.id)
    });
}

export function sortTripGroup(trips) {
  const today = dayjs();

  return trips.reduce(
    (groups, trip) => {
      const tripDate = dayjs(trip.date, 'YYYY/MM/DD');

      if (trip.status === 'pending') {
        groups.pendingGroup.push(trip);
      } else if (tripDate.isBefore(today)) {
        groups.pastGroup.push(trip);
      } else {
        groups.upcomingGroup.push(trip);
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
