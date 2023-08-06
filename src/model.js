const dayjs = require('dayjs');

export function getUserTrips(trips, userID) {
  return trips.filter(trip => trip.userID === userID);
}

export function getCostThisYear(trips, destinations) {
  const thisYear = dayjs().format('YYYY');

  const thisYearsTrips = trips.filter(
    trip => trip.status === 'approved' && trip.date.includes(thisYear),
  );

  const total = thisYearsTrips.reduce((sum, trip) => {
    const destination = destinations.find(
      destination => trip.destinationID === destination.id,
    );
    return sum + getTripCost(trip, destination);
  }, 0);

  return `You've put ${Math.round(total)} dollars into your journeys this year`;
}

export function getTripCost(trip, destination) {
  const totalCost =
    (trip.duration * destination.estimatedLodgingCostPerDay +
      destination.estimatedFlightCostPerPerson) *
    trip.travelers;

  const totalCostWithTip = totalCost * 1.1;

  return totalCostWithTip;
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

export function getNewId(trips) {
  return trips.sort((a, b) => b.id - a.id)[0].id + 1;
}
