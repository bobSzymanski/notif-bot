import fs from 'fs'; 
import path from 'path';

export default function loadJsonFile(filename) {
	const filepath = path.resolve(process.cwd(), filename);
	return fs.readFileSync(filepath);
}
