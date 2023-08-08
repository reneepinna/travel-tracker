import './images/samuel-ferrara-1527pjeb6jg-unsplash.jpg';
import './css/styles.scss';
const dayjs = require('dayjs');

import {
  getCostThisYear,
  getNewId,
  getUserTrips,
  sortTripGroup,
} from './model';
import { getApiData, getApiUserData } from './apiCalls';
import {
  displayCostThisYear,
  displayLoginError,
  displayUserData,
  displayUserTrips,
  initializeForm,
  renderDestinationCards,
  toggleLogInState,
} from './dom-updates';

function initializeStore() {
  const store = {};

  return {
    viewStore: function () {
      console.log(store);
    },
    setKey: function (key, value) {
      store[key] = value;
    },
    getKey: function (key) {
      return store[key];
    },
  };
}

export let store;

window.addEventListener('load', () => {
  store = initializeStore();
});

export function initializeUser(userID) {
  getApiUserData(`http://localhost:3001/api/v1/travelers/${userID}`)
}

export function initializeData(userID) {
  Promise.all([
    getApiData('http://localhost:3001/api/v1/trips', 'trips'),
    getApiData('http://localhost:3001/api/v1/destinations', 'destinations'),
  ])
    .then(values => {
      const [trips, destinations] = values;
      store.setKey('trips', trips);
      store.setKey('destinations', destinations);
      store.setKey('userTrips', getUserTrips(trips, userID));
    })
    .then(emp => {
      store.setKey('tripGroups', sortTripGroup(store.getKey('userTrips')));
      store.setKey(
        'costThisYear',
        getCostThisYear(
          store.getKey('userTrips'),
          store.getKey('destinations'),
        ),
      );
      toggleLogInState();
      displayDashboard();
      displayDestination();
    });
}

export function displayDashboard() {
  displayCostThisYear(store.getKey('costThisYear'));
  displayUserData(store.getKey('user'));
  displayUserTrips(store.getKey('tripGroups'), store.getKey('destinations'));
  getNewId(store.getKey('trips'));
}

export function displayDestination() {
  renderDestinationCards(store.getKey('destinations'));
  initializeForm(store.getKey('destinations'));
}
