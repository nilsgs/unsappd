const rp = require('request-promise-native');
const settings = require('./settings.json').untappd;

const getCheckins = (user, lastCheckin) => {
	const options = {
		uri: `${settings.host}${settings.path}/${user}`,
		qs: {
			client_id: settings.clientId,
			client_secret: settings.clientSecret,
			// min_id: lastCheckin
		},
		json: true
	};

	console.log(user + ' ' + lastCheckin);

	return rp(options)
		.then(result => result.response.checkins.items)
		// .then(a => console.log(a))
		.catch(error => console.error(error));
};

module.exports = getCheckins;