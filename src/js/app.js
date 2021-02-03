import { sortUsers, filterUsers, resetFilters } from './services.js';
import reformUserObj from './reformUserObj.js';
import makeCardTemplate from './template.js';

const contactsContainer = document.querySelector('.contacts-container');

const render = (state) => {
  const { filtration, users } = state;
  console.log('🚀 ~ file: app.js ~ line 9 ~ render ~ state', state);

  const sortedUsers = sortUsers(filtration.sort, users);
  const filteredUsers = filterUsers(filtration.filter, sortedUsers);
  const cards = filteredUsers.map((user) => makeCardTemplate(user)).join('');

  contactsContainer.innerHTML = cards;
};

const getUsers = async (state) => {
  try {
    const API_REQ = `https://randomuser.me/api/?results=30&seed=a123bc&nat=us,dk,fr,gb&inc=gender,name,registered,dob,location,picture,phone,email`;

    const response = await fetch(API_REQ);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const json = await response.json();
      const users = await json.results;
      savingUsers(state, users);
    }
  } catch (error) {
    console.error(error);
  }
};

const savingUsers = (state, users) => {
  state.users = users.map(reformUserObj);
};

const initialize = async (state) => {
  await getUsers(state);
  render(state);
};

export default () => {
  const state = {
    filtration: {
      sort: null,
      filter: {
        name: null,
        gender: null,
      },
    },
    users: [],
  };

  const sorters = document.querySelector('.sorters');
  sorters.addEventListener('change', ({ target }) => {
    const { name, value } = target;
    state.filtration[name] = value;
    render(state);
  });

  const filters = document.querySelector('.filters');
  filters.addEventListener('input', ({ target }) => {
    const { name, value } = target;
    state.filtration.filter[name] = value.toLowerCase();
    render(state);
  });

  const resetButton = document.querySelector('.reset-filters');
  resetButton.addEventListener('click', (e) => {
    e.preventDefault();
    resetFilters(state);
    render(state);
  });

  const menuTrigger = document.querySelector('.menu-trigger');
  const filterMenu = document.querySelector('.filter-sidebar');
  menuTrigger.addEventListener('click', () => {
    filterMenu.classList.toggle('visible');
  });

  initialize(state);
};
