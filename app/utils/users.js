import fs from 'fs';
import constants from '../resources/constants';
import log from './logger';

const fileName = './userlist.txt';

export function init() {
  try {
    fs.readFileSync(fileName);
  } catch (e) {
    if (e.code === 'ENOENT') {
      // File just doesn't exist. Make it!
      log('Initializing user list!');
      fs.writeFileSync(fileName, '');
    } else {
      throw e;
    }
  }
}

export function toggleState(userId) {
  const fileString = fs.readFileSync(fileName).toString();
  let state;
  let users;
  users = fileString.split(',').filter((elem) => { return elem.length > 1; }); // Filter out empty strings
  if (users.includes(userId)) { // if users has me, REMOVE me
    log('Removing user!');
    state = constants.USER_REMOVED_STATE;
    users = users.filter((user) => {
      return user !== userId;
    });
  } else {
    log('Adding user!');
    state = constants.USER_ADDED_STATE;
    users.push(userId);
  }

  fs.writeFileSync(fileName, users.toString());
  return state;
}

export function isUserEnabled(userId) {
  const fileString = fs.readFileSync(fileName).toString();
  const users = fileString.split(',');
  return users.includes(userId);
}

export default { init, isUserEnabled, toggleState };
