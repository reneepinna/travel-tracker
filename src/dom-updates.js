const dayjs = require('dayjs');

const userGreet = document.getElementById('userGreet');
const userName = document.querySelector('.profile__name');
const costThisYearBox = document.getElementById('costThisYear');
const nav = document.querySelector('nav');

const boards = document.querySelectorAll('.board');

const emptyMsgs = [...document.querySelectorAll('.trips-board__empty')];
const boardGroups = [...document.querySelectorAll('.trips-board__group--list')];
const tabBar = document.querySelector('.trips-board__tab-bar');
const tabGroups = document.querySelectorAll('.trips-board__group');
const tabs = document.querySelectorAll('.trips-board__tab');

const destinationBoardGroup = document.querySelector(
  '.destination-board__group',
);

export function displayUserData(user) {
  userGreet.innerText = `Welcome ${user.name.split(' ')[0]}`;
  userName.innerText = user.name;
}

export function displayUserTrips(tripGroups, destinations) {
  boardGroups.forEach(group => (group.innerHTML = ''));
  emptyMsgs.forEach(msg => msg.classList.remove('hidden'));

  const groupNames = Object.keys(tripGroups);

  groupNames.forEach(groupName => {
    if (tripGroups[groupName].length !== 0) {
      renderTripCards(groupName, tripGroups[groupName], destinations);
    }

    if (groupName === 'pendingGroup') {
      renderTabNotification(tripGroups[groupName]);
    }
  });
}

function renderTripCards(groupName, trips, destinations) {
  const emptyMsg = emptyMsgs.find(msg => msg.id === `${groupName}Msg`);
  const group = boardGroups.find(group => group.id === groupName);

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
      <div class='destCard__info'>
       <div class='destCard__price--block'>
         <p class='destCard__price'>${destination.estimatedLodgingCostPerDay}<span>/night</span></p>
       </div>
       <div class='destCard__price--block'>
         <p class='destCard__price'>${destination.estimatedFlightCostPerPerson}<span>/round trip</span></p>
       </div>
     </div>
     <button id='dest-${destination.id}-btn' class='tripCard__btn'>+</button>
    <div>
  </article>`;
  });
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

export function renderTabNotification(pendingTrips) {
  if (pendingTrips.length !== 0) {
    document.querySelector('.trips-board__tab__num').innerText =
      pendingTrips.length;
  }
}

export function displayCostThisYear(costThisYear) {
  costThisYearBox.innerText = `${costThisYear}`;
}

tabBar.addEventListener('click', e => {
  if (e.target.className === 'trips-board__tab') {
    tabs.forEach(tab => {
      if (tab.id === `${e.target.id}`) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    tabGroups.forEach(tabGroup => {
      if (tabGroup.id === `${e.target.id}Group`) {
        tabGroup.classList.remove('hidden');
      } else {
        tabGroup.classList.add('hidden');
      }
    });
  }
});

nav.addEventListener('click', e => {
  if (e.target.className.includes('control-bar__btn')) {
    changeBoardView(e);
  }
});

export function initializeForm(destinations) {
  const today = dayjs().format('MM/DD/YYYY');

  document.getElementById('startDate').setAttribute('max', today);
  document.getElementById('endDate').setAttribute('max', today);
  
  
  document.getElementById('destination-select').innerHTML = '';
  destinations.forEach(destination => {
    document.getElementById('destination-select').innerHTML += `<option value=${destination.id}>${destination.destination}<option/>`
  })
  
}

export function changeBoardView(e) {
  boards.forEach(board => {
    if (e.target.id.includes(board.id)) {
      board.classList.remove('hidden');
    } else {
      board.classList.add('hidden');
    }
  });
}

destinationBoardGroup.addEventListener('click', e => {
  if (e.target.className === 'tripCard__btn') {
    const destID = e.target.id.split('-')[1];
    console.log(destID);
  }
});

function openForm(destID) {

}