import health from '../services/health';
import pkg from '../../package.json';
import { mongoHealth } from '../utils/mongo';
import { discordPing } from '../services/discord';
import log from '../utils/logger';

const payload = {
  name: 'Discord notifications bot',
  description: pkg.description,
  version: pkg.version
};

export function get(req, res, _next) {
  return health(req.app)
    .then(() => {
      return mongoHealth();
    }).then(() => {
      return discordPing();
    }).then((ping) => { // We could mark unhealthy if this is high
      const body = {
        ...payload,
        discord_ping: ping
      };
      return res.status(200).json(body);
    })
    .catch((err) => {
      log('caught exception in health!');
      log(err);
      return res.status(503).send('Service Unavailable');
    });
}

export default { get };
