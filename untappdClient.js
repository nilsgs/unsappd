const _ = require('lodash');
const rp = require('request-promise-native');

const untappdClient = settings => {
	const getAllCheckins = (users, lastCheckins) => {
		const results = users.map(user => getCheckins(user, lastCheckins[user]));

		return Promise.all(results);
	}

	const getCheckinsFromResponse = response => {
		const isPaginated = _.has(response, 'checkins');
		const isNotPaginated = _.has(response, 'items');

		if(isPaginated){
			return response.checkins.items;
		}
		else if(isNotPaginated){ 
			return response.items;
		}
		else return [];
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

		console.info(`Untappd: Getting checkins for user: ${user} from checkin ${lastCheckin}`);

		return rp(options).then(result => {
			const checkins = getCheckinsFromResponse(result.response);
			console.info(`\tFound ${checkins.length} checkins for ${user}`); 

			return {
				user,
				items: checkins
			};
		});
	}

	return { getAllCheckins };
};

module.exports = untappdClient;