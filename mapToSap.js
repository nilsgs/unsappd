const moment = require('moment');

const mapToSap  = checkin => {
	// let date = moment(checkin.created_at, 'ddd, DD MMM YYYY HH:mm:ss Z');
	return {
		// checkin_id: checkin.checkin_id,
		// created_at: checkin.created_at,
		// date: date.format('YYYYMMDD'),
		// date_formated: date.format('DD.MM.YYYY'),
		// day_in_week: date.format('d'),
		// month_year: date.format('YYYY.MM'),
		// month: date.format('MM'),
		// year: date.format('YYYY'),
		// time_in_day: date.format('HH'),
		// checkin_comment: checkin.checkin_comment,
		// rating_score: checkin.rating_score,
		// user_name: checkin.user.user_name,
		// first_name: checkin.user.first_name,
		// beer_bid: checkin.beer.bid,
		// beer_name: checkin.beer.beer_name,
		// beer_style: checkin.beer.beer_style,
		// beer_abv: checkin.beer.beer_abv,
		// has_had: checkin.beer.has_had,
		// brewery_id: checkin.brewery.brewery_id,
		// brewery_name: checkin.brewery.brewery_name,
		// brewery_country: checkin.brewery.country_name,
		// brewery_city: checkin.brewery.location.brewery_city,
		// brewery_state: checkin.brewery.location.brewery_state,
		// location: checkin.venue.venue_name,
		// location_type: checkin.venue.primary_category,
		// location_country: checkin.venue.location.venue_country,
		// lat: checkin.venue.location.lat,
		// long: checkin.venue.location.lng,
		// comment_count: checkin.comments.total_count,
		// toast_count: checkin.toasts.total_count,
		// photo_url: checkin.media.items.photo.photo_img_og,
		// badge_count: checkin.badges.count,
		count: 1,
		target: 5
	}
};

module.exports = mapToSap;