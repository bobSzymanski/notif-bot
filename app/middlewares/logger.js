import log from '../utils/logger';

export default function logRequest(req, res, next) {
  log(req);
  return next();
}
