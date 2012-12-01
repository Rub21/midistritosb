function mmg_t(callback) {
    if (typeof reqwest === 'undefined'){
        throw 'CSV: reqwest required for mmg_csv_url';
    }
   // alert('nuevo t');

    var url = 'http://search.twitter.com/search.json?q=%23tachito';
    reqwest({
        url: url,
        type: 'jsonp',
        jsonpCallback: 'callback',
        success: response,
        error: response
    }); 
   
    function response(x) {
        var features = [],
            latfield = '',
            lonfield = '';
      /*  if (!x || !x.feed) return features;
        for (var f in x.feed.entry[0]) {
            if (f.match(/\$Lat/i)){
                latfield = f;           
            }
            if (f.match(/\$Lon/i)){
                lonfield = f;              
            }
        }*/

        for (var i = 0; i < x.feed.entry.length; i++) {                             
            var entry = x.feed.entry[i];
            var feature = {
                geometry: {
                    type: 'Point',
                    coordinates: []
                },
                properties: {
                    'marker-color':'#034',
                    /*'description': entry['gsx$descripción-comentario'].$t,  
                    'date': 'Fecha: ' + entry['gsx$fechaaviso'].$t,
                    'hour': 'Hora: ' + entry['gsx$horaaviso'].$t,
                    'marcatemporal':entry['gsx$marcatemporal'].$t    */  
                }
            };

            for (var y in entry) {
                if (y === latfield) feature.geometry.coordinates[1] = parseFloat(geo.coordinates[0]);
                else if (y === lonfield) feature.geometry.coordinates[0] = parseFloat(geo.coordinates[1]);
                else if (y.indexOf('gsx$') === 0) {                            
                    feature.properties[y.replace('gsx$', '')] = entry[y].$t;
                }
            }
            
            if (feature.geometry.coordinates.length == 2) features.push(feature);

          /*  _.each(feature, function(value, key) {
                if(feature.properties['title']=="Robo"){ feature.properties['marker-color']='#CB3344'} 
                if(feature.properties['title']=="Intento de Robo") {feature.properties['marker-color']='#FFCC33'}
                if(feature.properties['title']=="Agresión") { feature.properties['marker-color']='#653332'}
                if(feature.properties['title']=="Accidente") {feature.properties['marker-color']='#CC6633'}   
                if(feature.properties['title']=="Violencia Familiar") {feature.properties['marker-color']='#666535'}                         
                if(feature.properties['title']=="Otros") {feature.properties['marker-color']='#222222'}       
            });*/
        }
        return callback(features);
    }
}
