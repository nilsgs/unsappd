const fs = require('fs');

const updateCheckins = checkins => {
	const json = JSON.stringify(checkins);
	fs.writeFile('c:/Temp//lastCheckins.json', json, 'utf8', () => console.info('Checkins updated'));
};

module.exports = updateCheckins;