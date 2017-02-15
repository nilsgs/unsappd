const jsonfile = require('jsonfile');

const sapClient = settings => {
	const uploadData = data => {
		// Her skal vi laste opp til SAP
		jsonfile.writeFile('./data/upload.json', data, { spaces: 2 }, err => {
			if(err) console.error(err);
		});

		return data;
	};

	return { uploadData };
};

module.exports = sapClient;