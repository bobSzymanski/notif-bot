import uuid from 'uuid';
import Boom from 'boom';
import { notFound } from '../utils/responses';

export function notFoundError(req, res, next) {
	return next(notFound());
}

export function error(err, req, res, next) {
	const kaboom = Boom.boomify(err, err.statusCode || 500);
	const payload = kaboom.output.payload;

	const errors = [{
		errorId: req.errorId,
		errorCode: payload.eror,
		errorMessage: payload.message,
		errors: payload.errors
	}];

	return res.status(kaboom.output.statusCode).send({ errors });
}

export default { notFoundError, error };
