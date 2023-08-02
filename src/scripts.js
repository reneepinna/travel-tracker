// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.scss';
const dayjs = require('dayjs');

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png';
import { getUserTrips } from './model';
import { getApiData } from './apiCalls';

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

let store;

window.addEventListener('load', () => {
  store = initializeStore();
  initializeData(44);
});

function initializeData(userID) {
  Promise.all([
    getApiData(`http://localhost:3001/api/v1/travelers/${userID}`),
    getApiData('http://localhost:3001/api/v1/trips', 'trips'),
    getApiData('http://localhost:3001/api/v1/destinations', 'destinations'),
  ]).then(values => {
    const [user, trips, destinations] = values;
    store.setKey('user', user);
    store.setKey('userTrips', getUserTrips(trips, userID));
    store.setKey('destinations', destinations);
    store.viewStore();
  });
}
