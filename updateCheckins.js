const _ = require('lodash');
const jsonfile = require('jsonfile');

const updateCheckins = (values, original) => {
	const obj = _.reduce(values, (result, value, key) => {
		if(!_.isEmpty(value.checkins)){
			result[value.user] = value.checkins[0].checkin_id;
		}
		
		return result;
	}, original);

	console.info('Updating checkins');

	jsonfile.writeFile('./data/checkins.json', obj, { spaces: 2 }, err => {
		if(err) console.error(err);
	});
};

module.exports = updateCheckins;