import chai from 'chai';
const expect = chai.expect;

import data from './sample-data.js';
import {
  getUserDestinations,
  getUserTrips,
  sortTripGroup,
} from '../src/model.js';

describe('getUserTrips', function () {
  it('should return an array of only trips the user has taken', () => {
    const userID = 1;
    const userTrips = getUserTrips(data.trips, userID);

    expect(userTrips).to.deep.equal([
      {
        id: 1,
        userID: 1,
        destinationID: 1,
        travelers: 1,
        date: '2022/09/16',
        duration: 8,
        status: 'approved',
        suggestedActivities: [],
      },
      {
        id: 2,
        userID: 1,
        destinationID: 2,
        travelers: 5,
        date: '2022/10/04',
        duration: 18,
        status: 'approved',
        suggestedActivities: [],
      },
      {
        id: 3,
        userID: 1,
        destinationID: 3,
        travelers: 4,
        date: '2022/05/22',
        duration: 17,
        status: 'approved',
        suggestedActivities: [],
      },
    ]);
  });

  it('should return an empty array if there are no trips for that user', () => {
    const userID = 5;
    const userTrips = getUserTrips(data.trips, userID);

    expect(userTrips).to.deep.equal([]);
  });

  it('should return an empty array if there are no trips in the trip data', () => {
    const userId = 1;
    const trips = [];

    const userTrips = getUserTrips(trips, userId);

    expect(userTrips).to.deep.equal([]);
  });
});

describe('sortTripGroups', () => {
  let userID;
  let userTrips;

  beforeEach(() => {
    userID = 3;
    userTrips = getUserTrips(data.trips, userID);
  });

  it('should sort trips into an object of arrays with keys of pastGroup, pendingGroup, and upcomingGroup', () => {
    const groups = sortTripGroup(userTrips);
    const groupKeys = Object.keys(groups);

    expect(groups).to.be.an('object');
    expect(groupKeys).to.deep.equal([
      'pastGroup',
      'pendingGroup',
      'upcomingGroup',
    ]);
  });

  it('should sort any pending trips into pendingGroup even if the trip is scheduled in the past', () => {
    const groups = sortTripGroup(userTrips);

    expect(groups.pendingGroup).to.deep.equal([
      {
        id: 9,
        userID: 3,
        destinationID: 8,
        travelers: 5,
        date: '2025/12/19',
        duration: 19,
        status: 'pending',
        suggestedActivities: [],
      },
      {
        id: 10,
        userID: 3,
        destinationID: 9,
        travelers: 6,
        date: '2022/07/23',
        duration: 17,
        status: 'pending',
        suggestedActivities: [],
      },
    ]);
  });

  it('should sort approved trips based on if they are scheduled before or after the current date', () => {
    const groups = sortTripGroup(userTrips);

    expect(groups.pastGroup).to.deep.equal([
      {
        id: 8,
        userID: 3,
        destinationID: 7,
        travelers: 6,
        date: '2022/02/07',
        duration: 4,
        status: 'approved',
        suggestedActivities: [],
      },
    ]);
    expect(groups.upcomingGroup).to.deep.equal([
      {
        id: 7,
        userID: 3,
        destinationID: 6,
        travelers: 5,
        date: '2025/5/28',
        duration: 20,
        status: 'approved',
        suggestedActivities: [],
      },
    ]);
  });

  it('should return an object of arrays empty if there are no trips in that group', () => {
    userID = 5;
    userTrips = getUserTrips(data.trips, userID);

    const groups = sortTripGroup(userTrips);

    expect(groups).to.deep.equal({
      pastGroup: [],
      pendingGroup: [],
      upcomingGroup: [],
    });
  });
});

describe('getUserDestinations', () => {
  let userID;
  let userTrips;

  beforeEach(() => {
    userID = 1;
    userTrips = getUserTrips(data.trips, userID);
  });

  it('should return an array of only destinations the user has visited or will visit', () => {
    const userDestinations = getUserDestinations(data.destinations, userTrips);

    expect(userDestinations).to.deep.equal([
      {
        id: 1,
        destination: 'Lima, Peru',
        estimatedLodgingCostPerDay: 70,
        estimatedFlightCostPerPerson: 400,
        image:
          'https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80',
        alt: 'overview of city buildings with a clear sky',
      },
      {
        id: 2,
        destination: 'Stockholm, Sweden',
        estimatedLodgingCostPerDay: 100,
        estimatedFlightCostPerPerson: 780,
        image:
          'https://images.unsplash.com/photo-1560089168-6516081f5bf1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
        alt: 'city with boats on the water during the day time',
      },
      {
        id: 3,
        destination: 'Sydney, Austrailia',
        estimatedLodgingCostPerDay: 130,
        estimatedFlightCostPerPerson: 950,
        image:
          'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
        alt: 'opera house and city buildings on the water with boats',
      },
    ]);

    it('should return an empty array there are no trips', () => {
      userID = 5;
      userTrips = getUserTrips(data.trips, userID);

      const userDestinations = getUserDestinations(
        data.destinations,
        userTrips,
      );

      expect(userDestinations).to.deep.equal([]);
    });
  });
});

describe('getCostForYear', () => {});
