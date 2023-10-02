import health from '../services/health';
import loadJsonFile from '../utils/loadJsonFile';
import { discordPing } from '../services/discord';
import log from '../utils/logger';

const pkg = loadJsonFile('package.json');

const payload = {
  name: 'Discord notifications bot',
  description: pkg.description,
  version: pkg.version
};

export function get(req, res, _next) {
  return health(req.app)
    .then(() => {
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
