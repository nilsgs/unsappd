const settings = require('./settings.json');
const checkins = require('./data/checkins.json');

const untappdClient = require('./untappdClient');
const sapClient = require('./sapClient');
const mapper = require('./mapper');
const updateCheckins = require('./updateCheckins');

const untappd = untappdClient(settings.untappd);
const sap = sapClient(settings.sap);

console.info('Starting Unsappd');

untappd
    .getAllCheckins(settings.users, checkins)
    .then(mapper)
    .then(sap.uploadData)
    .then(data => updateCheckins(data, checkins))
    .catch(e => console.error(e));

// NOTE: For testing
// const results = require('./data/results_empty.json');
// Promise
// 	.resolve(results)
// 	.then(mapper)
// 	.then(sap.uploadData)
// 	.then(data => updateCheckins(data, checkins))
// 	.catch(e => console.error(e));