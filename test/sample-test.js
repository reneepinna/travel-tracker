import chai from 'chai';
const expect = chai.expect;

import data from './sample-data.js';
import { getUserTrips, sortTripGroup, getCostThisYear, validateUserName } from '../src/model.js';

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

describe('getCostThisYear', () => {
  let userID;
  let userTrips;

  it('should return a number representing the cost of all trips the user has taken and a 10% fee', () => {
    const userID = 2;
    const userTrips = getUserTrips(data.trips, userID);

    const cost = getCostThisYear(userTrips, data.destinations);

    expect(cost).to.equal(7216);
  });

  it('should return 0 if there are no trips for this year', () => {
    const userID = 5;
    const userTrips = getUserTrips(data.trips, userID);
  
    const cost = getCostThisYear(userTrips, data.destinations);

    expect(cost).to.equal(0);
  });

  it('should only calculate the cost for approved trips booked for this year', () => {
    const userID = 4;
    const userTrips = getUserTrips(data.trips, userID);

    const cost = getCostThisYear(userTrips, data.destinations);

    expect(cost).to.equal(28270);
  });
});

describe('', () => {
  it('should return a number that represents the user is if the username is correct', () => {
    const username = 'traveler35';
    const userID = validateUserName(username);

    expect(userID).to.equal(50)
  })
  it('should return null if the username is not in the correct format', () => {
    const username = '35traveler';
    const userID = validateUserName(username);

    expect(userID).to.equal(null)
  }) 
})