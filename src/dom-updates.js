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
      renderCards(groupName, tripGroups[groupName], destinations);
    }
  });
}