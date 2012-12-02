// Fetch tweets from Twitter
tweetRace.getTweets = function(d) {
    tweetRace.params.q = query;
    tweetRace.params.geocode = geo;    

    params = '?' + _.map(tweetRace.params, function(num, key) {
        return key + "=" + num;
    }).join('&');
        
    reqwest({
        url: 'http://search.twitter.com/search.json?q=#tachito',
        type: 'jsonp',
        jsonCallback: 'callback',
        success: function(d) {
            tweetRace.processTweet(d);
        }
    });
};


// Extract relevant data from tweets
tweetRace.processTweet = function(d) {
    _.each(d.results, function(element, index) {
        if (element.geo && element.geo.type === 'Point') {
            var lat = element.geo.coordinates[0], // Twitter seems to reverse the
                lon = element.geo.coordinates[1]; // order of geojson coordinates
                
        } else if (element.location && element.location.indexOf(': ') > 0) {
            var coords = element.location.split(': ')[1],
                $lat = coords.split(',')[0] || 0,
                $lon = coords.split(',')[1] || 0;

            if (!isNaN(parseFloat($lat)) && !isNaN(parseFloat($lon))) {
                var lon = parseFloat($lon),
                    lat = parseFloat($lat);
            }
        }
        
        if (lat && lon) {
            tweetRace.tweets.push({
                lon: lon,
                lat: lat,
                time: formatDate(new Date(element.created_at)),
                text: element.text,
                user: '@' + element.from_user,
                category: (element.text.toLowerCase().indexOf(tweets[0].toLowerCase()) >= 0) ? 'first' : 'second'
            });
        }
    });
    
    tweetRace.params.since_id = d.max_id_str;
    tweetRace.map();
    
  }