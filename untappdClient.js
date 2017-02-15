const _ = require('lodash');
const rp = require('request-promise-native');

const untappdClient = settings => {
	const getAllCheckins = (users, lastCheckins) => {
		const results = users.map(user => getCheckins(user, lastCheckins[user]));

		return Promise.all(results);
	}

	const getCheckins = (user, lastCheckin) => {
		const options = {
			uri: `${settings.host}${settings.path}/${user}`,
			qs: {
				client_id: settings.clientId,
				client_secret: settings.clientSecret,
				min_id: lastCheckin
			},
			json: true
		};	

		return rp(options).then(result => ({ 
			user,
			items: _.has(result, 'response.checkins.items') ? result.response.checkins.items : []
		}));
	}

	return { getAllCheckins };
};

module.exports = untappdClient;