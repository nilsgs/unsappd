const users = require('./settings.json').users;
const checkins = require('./lastCheckins.json');
const getCheckins = require('./untappdClient');
const mapToSap = require('./mapToSap');
const updateCheckins = require('./updateCheckins');

users.forEach(user => {
	getCheckins(user, checkins[user])
		.then(mapToSap)
		.then(obj => {
			if(obj.length > 0) {
				checkins[user] = obj[0].checkin_id
			}
		})
		.then(() => updateCheckins(checkins));
});