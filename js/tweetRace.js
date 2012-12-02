var json_t;


var tweetRace = {};

//alert('ttttttttt');
// Array for tweets queue
tweetRace.tweets = [];

    var tweets = [
            '%23tachito',             // First term
          '%23tachito',             // Second term
            '-12,-73,1500mi'     // search location and radius (lat,lon,radius)
        ];


function mm_twitter(callback){

// Start the race with settings from tweets[]
//tweetRace.start = _.throttle(function(){
     //alert('rrrr');
    /*$('th.first').text(tweets[0] + ' tweets');
    $('th.second').text(tweets[1] + ' tweets');*/


    getTweets(tweets[0] + ' OR ' + tweets[1], tweets[2]);
   // alert(tweets[0] + ' ---' + tweets[1]+'------'+ tweets[2])
   
//}, 2000);




var params = {
    rpp: 100,
    callback: 'callback',
    result_type: 'recent'
};

// Fetch tweets from Twitter
function getTweets (query, geo) {



       /* console.log(query);
    console.log(geo);

    params.q = query;
   params.geocode = geo;    

    params = '?' + _.map(params, function(num, key) {
        return key + "=" + num;
    }).join('&');
        */


        //alert('http://search.twitter.com/search.json' + params);
    reqwest({
        url: 'http://search.twitter.com/search.json?q=%23tachito' ,
        type: 'jsonp',
        jsonCallback: 'callback',
        success: processTweet
     
    });
}

var puntos = []


// Extract relevant data from tweets
 function processTweet (d) {
        //console.log(d.results);
        var features_t=[];

    _.each(d.results, function(element, index) {
        
     

        if (element.geo && element.geo.type === 'Point') {

               features_t.push(element);//console.log(element);
                tweetRace.resultado.push(element);


              /* 
            var lat = element.geo.coordinates[0], // Twitter seems to reverse the
                lon = element.geo.coordinates[1]; // order of geojson coordinates
            */
         
                
        } else if (element.location && element.location.indexOf(': ') > 0) {
            var coords = element.location.split(': ')[1],
                $lat = coords.split(',')[0] || 0,
                $lon = coords.split(',')[1] || 0;

            if (!isNaN(parseFloat($lat)) && !isNaN(parseFloat($lon))) {
                var lon = parseFloat($lon),
                    lat = parseFloat($lat);
            }
        }
        

    });

console.log('oooooooooooooooooooooooooo')

//console.log(features_t)
    
return  callback(features_t);

}








}




///////kiwi no

// Update counters
tweetRace.counters = function() {
    var first = $('.mmg-first').length,
        second = $('.mmg-second').length;
    
    if (first > 0) {
        $('td.first').text(first);
    } else {
        $('td.first').text('--');
    }
    if (second > 0) {
        $('td.second').text(second);
    } else {
        $('td.second').text('--');
    }
};



 var points = { 'type': 'FeatureCollection',
        'features': []
    };











// Pause / play button
$('#stop').click(function(e){
    e.preventDefault();
    $(this).toggleClass('start');
    if (tweetRace.stop) {
        $(this).text('Pause');
        tweetRace.stop = false;
        tweetRace.start();
    } else { 
        $(this).text('Start');
        tweetRace.stop = true;
    }
});
