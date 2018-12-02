export function handleDiscordEvent(req, res) {
  return res.status(200).json({ status: 'OK' });
}

export default { handleDiscordEvent };
