import Boom from 'boom';

export function unauthorized(message) {
  return Boom.unauthorized(message);
}

export function badRequest(message) {
  return Boom.badRequest(message);
}

export function notFound() {
  return Boom.notFound('The specified resource was not found.');
}

export function unprocessableEntity(message) {
  return Boom.badData(message);
}
