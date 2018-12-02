import Promise from 'bluebird';

export default function health(app) {
	return Promise.resolve(true);
}
