import { setApiData } from './apiCalls';
import {
  getNewId,
  validatePassword,
  validateUserName,
  getTripCost,
} from './model';
import { store, initializeUser } from './scripts';

const dayjs = require('dayjs');

//Query Selectors
const loginPage = document.querySelector('.login-page');
const loginForm = document.querySelector('.login-form');
const mainSite = document.querySelector('.website');
const loginError = document.querySelector('.login-error-box')

const userGreet = document.getElementById('userGreet');
const userName = document.querySelector('.profile__name');
const costThisYearBox = document.getElementById('costThisYear');
const nav = document.querySelector('nav');

const boards = document.querySelectorAll('.board');

const emptyMsgs = [...document.querySelectorAll('.trips-board__empty')];
const tripBoardGroups = [
  ...document.querySelectorAll('.trips-board__group--list'),
];
const tabBar = document.querySelector('.trips-board__tab-bar');
const tabGroups = document.querySelectorAll('.trips-board__group');
const tabs = document.querySelectorAll('.trips-board__tab');

const destinationBoardGroup = document.querySelector(
  '.destination-board__group',
);

const form = document.querySelector('.destination-form');
const estimatedCostForm = document.querySelector('.estimated-cost-form');
const closeFormBtn = document.querySelector('.close-form-btn');
const formErrorBox = document.querySelector('.form-error');
const estimatedCost = document.querySelector('.estimated-cost');

// Toggle Screen States
export function toggleLogInState() {
  loginPage.classList.toggle('hidden');
  mainSite.classList.toggle('hidden');
}

export function changeTabVeiw(tabID) {
  tabs.forEach(tab => {
    if (tab.id === tabID) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  tabGroups.forEach(tabGroup => {
    if (tabGroup.id === `${tabID}Group`) {
      tabGroup.classList.remove('hidden');
    } else {
      tabGroup.classList.add('hidden');
    }
  });
}

export function changeBoardView(boardName) {
  boards.forEach(board => {
    if (boardName.includes(board.id)) {
      board.classList.remove('hidden');
    } else {
      board.classList.add('hidden');
    }
  });
}

// Display Functions

export function displayUserData(user) {
  userGreet.innerText = `Welcome ${user.name.split(' ')[0]}`;
  userName.innerText = user.name;
}

export function displayUserTrips(tripGroups, destinations) {
  tripBoardGroups.forEach(group => (group.innerHTML = ''));
  emptyMsgs.forEach(msg => msg.classList.remove('hidden'));

  const groupNames = Object.keys(tripGroups);

  groupNames.forEach(groupName => {
    if (tripGroups[groupName].length !== 0) {
      renderTripCards(groupName, tripGroups[groupName], destinations);
    }
  });
}

function renderTripCards(groupName, trips, destinations) {
  const emptyMsg = emptyMsgs.find(msg => msg.id === `${groupName}Msg`);
  const group = tripBoardGroups.find(group => group.id === groupName);

  emptyMsg.classList.add('hidden');

  trips.forEach(trip => {
    const destination = destinations.find(
      destination => trip.destinationID === destination.id,
    );

    const date = dayjs(trip.date, 'YYYY/MM/DD');

    group.innerHTML += `<article id='trip-${trip.id}' class='tripCard'>
      <img class='tripCard__img' src=${destination.image} alt=${
      destination.alt
    }/>
      <div class='tripCard__info'>
        <p class='tripCard__location'>${destination.destination}</p>
        <p class='tripCard__date'>${date.format('MM/DD/YYYY')} - ${date
      .add(trip.duration, 'day')
      .format('MM/DD/YYYY')}</p>
        <p class='tripCard__travlers'>${formatTravlerNumber(trip.travelers)}</p>
      <div>
    </article>`;
  });
}

export function renderDestinationCards(destinations) {
  destinationBoardGroup.innerHTML = '';

  destinations.forEach(destination => {
    destinationBoardGroup.innerHTML += `<article id='dest-${destination.id}' class='tripCard'>
    <img class='tripCard__img' src=${destination.image} alt=${destination.alt}/>
    <div class='tripCard__info'>
      <p class='tripCard__location'>${destination.destination}</p>
      <div class='tripCard__info'>
       <div class='destCard__price--block'>
         <p class='destCard__price'>${destination.estimatedLodgingCostPerDay}<span>/night</span></p>


         <p class='destCard__price'>${destination.estimatedFlightCostPerPerson}<span>/round trip</span></p>
       </div>
     </div>
     <button id='dest-${destination.id}-btn' class='tripCard__btn'>+</button>
    <div>
  </article>`;
  });
}

export function displayCostThisYear(costThisYear) {
  costThisYearBox.innerText = `${costThisYear}`;
}

function formatTravlerNumber(num) {
  switch (num) {
    case 1:
      return `Just you`;
    case 2:
      return `You and another`;
    default:
      return `You and ${num - 1} others`;
  }
}

export function displayLoginError(error) {
  loginError.innerText = error;
}

// Form Functions

export function initializeForm(destinations) {
  const today = dayjs().format('YYYY-MM-DD');

  document.getElementById('startDate').setAttribute('min', today);
  document.getElementById('endDate').setAttribute('min', today);

  const select = document.getElementById('destination-select');
  destinations.forEach(destination => {
    select.options[select.options.length] = new Option(
      destination.destination,
      destination.id,
    );
  });
}

export function prepareFormByDest(destID) {
  window.scrollTo(0, 0);

  const options = [...document.querySelectorAll('option')];

  const destinationOption = options.find(
    option => option.value === `${destID}`,
  );
  destinationOption.setAttribute('selected', true);
}

function resetForm() {
  form.reset();
  formErrorBox.innerText = '';
}

function formatFormData() {
  const formData = new FormData(form);

  const startDate = dayjs(formData.get('startDate'), 'YYYY-MM-DD');
  const endDate = dayjs(formData.get('endDate'), 'YYYY-MM-DD');
  const duration = endDate.diff(startDate, 'd');

  return {
    id: getNewId(store.getKey('trips')),
    userID: store.getKey('user').id,
    destinationID: parseInt(formData.get('destinationID')),
    travelers: parseInt(formData.get('travelers')),
    date: startDate.format('YYYY/MM/DD'),
    duration: duration,
    status: 'pending',
    suggestedActivities: [],
  };
}

function getLoginFormData() {
  const formData = new FormData(loginForm);

  return {
    userName: formData.get('username'),
    password: formData.get('password'),
  };
}

function validateTripDate(body) {
  if (body.duration <= 0) {
    formErrorBox.innerText = `Your trip's end date must be after your trip's start date.`;
  } else {
    return true;
  }
}

//Event Listeners

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  loginForm.reportValidity();

  const loginData = getLoginFormData();
  const userID = validateUserName(loginData.userName);
  if (!userID || !validatePassword(loginData.password)) {
   displayLoginError(`Your Username or Password is incorrect`);
  } else {
    initializeUser(userID)
  }
  loginForm.reset()
});

tabBar.addEventListener('click', e => {
  if (e.target.className === 'trips-board__tab') {
    changeTabVeiw(e.target.id);
  }
});

nav.addEventListener('click', e => {
  if (e.target.className.includes('control-bar__btn')) {
    changeBoardView(e.target.id);
  }
});

destinationBoardGroup.addEventListener('click', e => {
  if (e.target.className === 'tripCard__btn') {
    const destID = e.target.id.split('-')[1];
    prepareFormByDest(destID);
    changeBoardView('form-board');
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  form.reportValidity();

  const formData = formatFormData();

  if (validateTripDate(formData)) {
    form.classList.toggle('hidden');
    estimatedCostForm.classList.toggle('hidden');
    estimatedCost.innerText = `This trip is estimated to cost about ${getTripCost(
      formData,
      store.getKey('destinations'),
    )} dollars.`;
  }
});

estimatedCostForm.addEventListener('submit', (e) => {
  e.preventDefault();
  setApiData(formatFormData());
  form.classList.toggle('hidden');
  estimatedCostForm.classList.toggle('hidden');
  resetForm();
  changeBoardView('trips-board');
  changeTabVeiw('pending');
});

closeFormBtn.addEventListener('click', () => {
  resetForm();
  changeBoardView('destination-board');
});
