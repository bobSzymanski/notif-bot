import Promise from 'bluebird';

export default function health() {
  return Promise.resolve(true);
}
