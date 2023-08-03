import chai from 'chai';
const expect = chai.expect;

import data from './sample-data.js';
import { getUserTrips, sortTripGroup } from '../src/model.js';

describe('getUserTrips', function () {
  it('should return an array of only trips taken by the user passed in', () => {
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

    expect(groups.pastGroup).to.deep.equal([{
      id: 8,
      userID: 3,
      destinationID: 7,
      travelers: 6,
      date: '2022/02/07',
      duration: 4,
      status: 'approved',
      suggestedActivities: [],
    }]);
    expect(groups.upcomingGroup).to.deep.equal([{
      id: 7,
      userID: 3,
      destinationID: 6,
      travelers: 5,
      date: '2025/5/28',
      duration: 20,
      status: 'approved',
      suggestedActivities: [],
    }]);
  });

  it('should leave arrays empty if their are no trips in that group', () => {
    userID = 5;
    userTrips = getUserTrips(data.trips, userID);

    const groups = sortTripGroup(userTrips);

    expect(groups).to.deep.equal({
      pastGroup: [],
      pendingGroup: [],
      upcomingGroup: []
    })
  })
});
