const dayjs = require('dayjs');

const userGreet = document.getElementById('userGreet');
const emptyMsgs = [...document.querySelectorAll('.trips-board__empty')];
const boardGroups = [...document.querySelectorAll('.trips-board__group__list')];

export function displayUserData(user) {
  userGreet.innerText = `Welcome ${user.name.split(' ')[0]}`;
}

export function displayUserTrips(tripGroups, destinations) {
  boardGroups.forEach(group => (group.innerHTML = ''));
  emptyMsgs.forEach(msg => (msg.style.display = 'block'));

  const groupNames = Object.keys(tripGroups);

  groupNames.forEach(groupName => {
    if (!tripGroups[groupName].length !== 0) {
      renderTripCards(groupName, tripGroups[groupName], destinations);
    }
  });
}

function renderTripCards(groupName, trips, destinations) {
  const emptyMsg = emptyMsgs.find(msg => msg.id === `${groupName}Msg`);
  const group = boardGroups.find(group => group.id === groupName);

  emptyMsg.style.display = 'none';

  trips.forEach(trip => {
    const destination = destinations.find(
      destination => trip.destinationID === destination.id,
    );

    const date = dayjs(trip.date, 'YYYY/MM/DD');

    group.innerHTML += `<article class='card'>
      <img class='card__img' src=${destination.image}/>
      <div class='card__info'>
        <p class='card__location'>${destination.destination}</p>
        <p class='card__text'>${date.format('MM/DD/YYYY')}</p>
        <p class='card__text'>${date
          .add(trip.duration, 'day')
          .format('MM/DD/YYYY')}</p>
        <p class='card__text'>${trip.travelers} people</p>
      <div>
    </article>`;
  });
}