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
  
    return sum + getTripCost(trip, destinations);
  }, 0);

  return `You've put ${Math.round(total)} dollars into your journeys this year`;
}

export function getTripCost(trip, destinations) {
  const destination = destinations.find(
    destination => trip.destinationID === destination.id,
  );

  const totalCost =
    (trip.duration * destination.estimatedLodgingCostPerDay +
      destination.estimatedFlightCostPerPerson) *
    trip.travelers;

  const totalCostWithTip = totalCost * 1.1;

  return Math.round(totalCostWithTip)
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

export function validateUserName(username) {
  const regex = /traveler(\d{1,})/;
  const result = username.match(regex)

  if (result) {
    return parseInt(result[1])
  }

  return result
}

export function validatePassword(password) {
  return (password === 'travel')
}