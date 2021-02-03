const sortBy = (field, reverse) => {
  const getValue = (obj) => obj[field];
  const order = JSON.parse(reverse) ? -1 : 1;

  return (a, b) => {
    const aVal = getValue(a);
    const bVal = getValue(b);
    return order * ((aVal > bVal) - (bVal > aVal));
  };
};

const filters = {
  gender: (value) => ({ gender }) => {
    if (value === 'both') return true;
    return gender === value;
  },
  name: (value) => ({ name }) => {
    if (value === '') return true;
    return name.toLowerCase().includes(value);
  },
};

export const sortUsers = (query, users) => {
  if (!query) return users;
  const [field, reverse] = query.split('_');
  const sorter = sortBy(field, reverse);
  return users.slice().sort(sorter);
};

export const sortUsers = (query, users) => {};

export const filterUsers = (query, users) => {
  const fields = Object.keys(query);
  const activeFields = fields.filter((field) => query[field]);
  const result = activeFields.reduce((acc, field) => {
    const filterName = field;
    const match = filters[filterName];
    return acc.filter((user) => match(query[field])(user));
  }, users);

  return result;
};

export const resetFilters = ({ filtration }) => {
  for (let field in filtration) {
    if (typeof filtration[field] === 'object') {
      resetFilters(filtration[field]);
    } else {
      filtration[field] = null;
    }
  }
};
