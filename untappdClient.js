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

        if (isPaginated) {
            return response.checkins.items;
        }
        else if (isNotPaginated) {
            return response.items;
        }
        else return [];
    }

    const getCheckins = (user, lastCheckin) => {
        console.info(`Untappd: Getting checkins for user: ${user} from checkin ${lastCheckin}`);
        
        return rp(getOptions(user, lastCheckin)).then(result => {
            console.info('\tGot the results with min_id');
            return createResult(result, user);
        }).catch(e => {
            return rp(getOptions(user)).then(result => {
                console.info('\tGot the results without min_id');
                return createResult(result, user, lastCheckin);
            });
        });
    }

    const getOptions = (user, min_id) => {
        let qs = {client_id: settings.clientId, client_secret: settings.clientSecret};
        if(min_id)
            qs = _.assign({}, qs, {min_id});

        return {
            uri: `${settings.host}${settings.path}/${user}`,
            qs,
            json: true
        }
    };

    const createResult = (result, user, lastCheckin) => {
        const checkins = getCheckinsFromResponse(result.response);

        const filteredCheckins = _.filter(checkins, c => c.checkin_id > (lastCheckin || 0));

        console.info(`\tFound ${filteredCheckins.length} checkins for ${user}`);
        return {
            user,
            items: filteredCheckins
        };
    }

    return { getAllCheckins };
};

module.exports = untappdClient;