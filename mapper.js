const _ = require('lodash');
const moment = require('moment');
var SuperOM = require('super-object-mapper');

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

const dummy = '**NGS**';
const createMap = (key, transform) => ({ 
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
		'checkin_comment': createMap('checkin_comment'),
		'rating_score': 'rating_score',
		'user.user_name': 'user_name',
		'user.first_name': 'first_name',
		'beer.bid' : 'beer_bid',
		'beer.beer_name': 'beer_name',
		'beer.beer_style': 'beer_style',
		'beer.beer_abv': 'beer_abv',
		'beer.has_had': createMap('has_had'),
		'brewery.brewery_id': 'brewery_id',
		'brewery.brewery_name': 'brewery_name',
		'brewery.country_name': 'brewery_country',
		'brewery.location.brewery_city': createMap('brewery_city'),
		'brewery.location.brewery_state': createMap('brewery_state'),
		'venue.venue_name': createMap('location', true),
		'venue.primary_category': createMap('location_type', true),
		'venue.location.venue_country': createMap('location_country', true),
		'venue.location.lat': createMap('lat', true),
		'venue.location.lng': createMap('long', true),
		'comments.total_count': createMap('comment_count'),
		'toasts.total_count': createMap('toast_count'),
		'badges.count': createMap('badge_count'),
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
		return _.transform(object, (result, value) => {
			const dummyValues = _.pickBy(value, x => x === dummy);
			const filtered = _.mapValues(dummyValues, () => null);
			result.push(_.assign(value, filtered));
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