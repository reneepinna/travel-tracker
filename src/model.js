export function getUserTrips(trips, userID) {
  return trips.filter(trip => trip.id === userID)
}

