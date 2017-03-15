const _ = require('lodash');
const rp = require('request-promise-native');
const jsonfile = require('jsonfile');

const map = data => {
	return _.reduce(data, (result, value, key) => {
		result.push(...value.checkins);
		return result;
	}, []);
};

const toPayload = (data, messageType) => ({
	mode: 'sync',
	messageType: messageType,
	messages: map(data)
});

const sapClient = settings => {
	const uploadData = data => {
		const payload = toPayload(data, settings.messageType);
		
		if(payload.messages.length === 0){
			console.info('No data found');
			return data;
		}

		const options = {
			uri: `${settings.host}${settings.path}`,
			method: 'POST',
			body: payload,
			headers: {
				'Authorization': `Bearer ${settings.token}`,
				'Content-Type': 'application/json;charset=utf-8'
			},
			json: true
		};

		console.info('Starting upload to SAP');
		return rp(options).then(response => data);
	};

	return { uploadData };
};

module.exports = sapClient;