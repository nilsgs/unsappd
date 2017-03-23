const _ = require('lodash');
const moment = require('moment');
var SuperOM = require('super-object-mapper');

//TODO: Dette er grisete kode, clean up når tid

var removeFalsies = function (obj) {
    return _.transform(obj, function (o, v, k) {
        if (v && typeof v === 'object') {
            o[k] = _.removeFalsies(v);
        } else if (v) {
            o[k] = v;
        }
    });
};

_.mixin({ 'removeFalsies': removeFalsies });

const formatDate = (date, format) => moment(date, 'ddd, DD MMM YYYY HH:mm:ss Z').format(format);

const dummyNull = '**NULL**';
const dummyNumber = '**NUMBER**';
const createMap = (key, dummy, transform) => ({ 
	key, default: () => dummy, 
	transform: val => { 
		if(!transform) return val;
		if(_.isArray(val)) return dummy
	}
});

const map = {
	sap: {
		'checkin_id': 'checkin_id',
		'created_at': [
			{
				'key': 'created_at',
				'transform': value => moment(value, 'ddd, DD MMM YYYY HH:mm:ss Z')
			},
			{
				'key': 'date',
				'transform': value => formatDate(value, 'YYYYMMDD')
			},
			{
				'key': 'date_formated',
				'transform': value => formatDate(value, 'DD.MM.YYYY')
			},
			{
				'key': 'day_in_week',
				'transform': value => formatDate(value, 'dddd')
			},
			{
				'key': 'month_year',
				'transform': value => formatDate(value, 'YYYY.MM')
			},
			{
				'key': 'month',
				'transform': value => formatDate(value, 'MMMM')
			},
			{
				'key': 'month_number',
				'transform': value => formatDate(value, 'MM')
			},
			{
				'key': 'year',
				'transform': value => formatDate(value, 'YYYY')
			},
			{
				'key': 'time_in_day',
				'transform': value => formatDate(value, 'HH')
			}
		],
		'checkin_comment': createMap('checkin_comment', dummyNull),
		'rating_score': createMap('rating_score', dummyNumber),
		'user.user_name': createMap('user_name', dummyNull),
		'user.first_name': createMap('first_name', dummyNull),
		'beer.bid' : createMap('beer_bid', dummyNull),
		'beer.beer_name': createMap('beer_name', dummyNull),
		'beer.beer_style': createMap('beer_style', dummyNull),
		'beer.beer_abv': createMap('beer_abv', dummyNumber),
		'beer.has_had': createMap('has_had'),
		'brewery.brewery_id': createMap('brewery_id', dummyNull),
		'brewery.brewery_name': createMap('brewery_name', dummyNull),
		'brewery.country_name': createMap('brewery_country', dummyNull),
		'brewery.location.brewery_city': createMap('brewery_city', dummyNull),
		'brewery.location.brewery_state': createMap('brewery_state', dummyNull),
		'venue.venue_name': createMap('location', dummyNull, true),
		'venue.primary_category': createMap('location_type', dummyNull, true),
		'venue.location.venue_country': createMap('location_country', dummyNull, true),
		'venue.location.lat': createMap('lat', dummyNumber, true),
		'venue.location.lng': createMap('long', dummyNumber, true),
		'comments.total_count': createMap('comment_count', dummyNumber),
		'toasts.total_count': createMap('toast_count', dummyNumber),
		'badges.count': createMap('badge_count', dummyNumber),
		'media.items[0].photo.photo_img_og': createMap('photo_url'),
		'sap-count': {
			'key': 'count',
			'default': () => 1
		},
		'sap-target': {
			'key': 'target',
			'default': () => 5
		}
	}
};

const superOM = new SuperOM();
superOM.addMapper(map, 'default');

const mapper = results => {
	console.info('Starting mapping');

	const filterValues = object => {
		const filterBy = (obj, dummy, placeholder) => {
			const matches = _.pickBy(obj, val => val === dummy);
			return _.mapValues(matches, () => placeholder);
		};

		return _.transform(object, (result, value) => {
			result.push(_.assign(value, filterBy(value, dummyNull, ''), filterBy(value, dummyNumber, 0)));
		});
	}

	return results.map(result => {
		const mappedValues = superOM.mapObject(_.removeFalsies(result.items), { mapper: 'default', map: 'sap' });

		return {
			user: result.user,
			checkins: filterValues(mappedValues)
		}
	});
};

module.exports = mapper;