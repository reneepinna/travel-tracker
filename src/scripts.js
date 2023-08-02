// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.scss';
const dayjs = require('dayjs')

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

import {
  getApiData,
  
} from './apiCalls';

// function initializeDataModel() {
//   return 
// }

function initializeData(userID) {
  Promise.all([
    getApiData(`http://localhost:3001/api/v1/travelers/${userID}`),
    getApiData('http://localhost:3001/api/v1/trips'),
    getApiData('http://localhost:3001/api/v1/destinations')
  ])
}



