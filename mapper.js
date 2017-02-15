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

const superOM = new SuperOM();
const map = {
	sap: {
		'checkin_id': 'checkin_id',
		'created_at': {
			'key': 'created_at',
			'transform': value => moment(value, 'ddd, DD MMM YYYY HH:mm:ss Z')
		},
		'checkin_comment': 'checkin_comment',
		'rating_score': 'rating_score',
		'user.user_name': 'user_name',
		'user.first_name': 'first_name',
		'beer.bid' : 'beer_bid',
		'beer.beer_name': 'beer_name',
		'beer.beer_style': 'beer_style',
		'beer.beer_abv': 'beer_abv',
		'beer.has_had': 'has_had',
		'brewery.brewery_id': 'brewery_id',
		'brewery.brewery_name': 'brewery_name',
		'brewery.country_name': 'brewery_country',
		'brewery.location.brewery_city': 'brewery_city',
		'brewery.location.brewery_state': 'brewery_state',
		'venue.venue_name': {
			'key': 'location',
			'transform': value => {
				if(_.isArray(value)) return undefined;
			}
		},
		'venue.primary_category': {
			'key': 'location_type',
			'transform': value => {
				if(_.isArray(value)) return undefined;
			}
		},
		'venue.location.venue_country': {
			'key': 'location_country',
			'transform': value => {
				if(_.isArray(value)) return undefined;
			}
		},
		'venue.location.lat': {
			'key': 'lat',
			'transform': value => {
				if(_.isArray(value)) return undefined;
			}
		},
		'venue.location.lng': {
			'key': 'long',
			'transform': value => {
				if(_.isArray(value)) return undefined;
			}
		},
		'comments.total_count': 'comment_count',
		'toasts.total_count': 'toast_count',
		'badges.count': 'badge_count',
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

superOM.addMapper(map, 'default');

const mapper = results => results.map(result => ({
		user: result.user,
		checkins: superOM.mapObject(_.removeFalsies(result.items), { mapper: 'default', map: 'sap', clean: true })
}));

module.exports = mapper;