var data_id = '0AhfXukqwpMbidFEwQXVWNFdRLXdJZVcwamlUWDRvemc',
    map_id='jimmyvelasquez.lima',
    markerLayer,
    features,
    features_summary,
    interaction,
    map = mapbox.map('map'),
    a_tipo_incidente=[],
    a_cantidad_type=[],
    a_cantjanuary=[],
    a_cantfebruary=[],
    a_cantmarch=[],
    a_cantapril=[],
    a_canmay=[],
    a_cantjune=[],
    a_cantjuly=[],
    a_cantaugust=[],
    a_cantseptember=[],
    a_cantoctober=[],
    a_cantnovember=[],
    a_cantdecember=[],
    monthNames = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Setiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ];

map.addLayer(mapbox.layer().id(map_id));
mmg_google_docs_spreadsheet_1(data_id, mapData );
map.centerzoom({  lat: -12.04157,  lon: -77.05688}, 14);
map.setZoomRange(10, 15);

// Build map
function mapData(f) { 
    features = f;
    markerLayer = mapbox.markers.layer().features(features);
    //Center markers layer
    markerLayer.factory(function (m) {
        // Create a marker using the simplestyle factory
        var elem = mapbox.markers.simplestyle_factory(m);
        // Add function that centers marker on click
        MM.addEvent(elem, 'click', function (e) {
            map.ease.location({
                lat: m.geometry.coordinates[1],
                lon: m.geometry.coordinates[0]
            }).zoom(map.zoom()).optimal();
        });
            return elem;
    });

    interaction = mapbox.markers.interaction(markerLayer);
    map.addLayer(markerLayer);
    map.ui.zoomer.add();
    map.ui.zoombox.add();

    interaction.formatter(function (feature) {
        var o = '<h3> Basura</h3>' +
        '<p>' + feature.properties.description + '</p>' +
        '<p><strong> Fecha :</strong> ' + 
        feature.properties.date.replace('Fecha: ',"") + ' '+
        feature.properties.hour.replace('Hora: ',"")+'</p>' ;
        return o;
    });

    //fmonth(features);    
    //Out url for download  data
    download_data();
    $('#map').removeClass('loading');
}

function newMarker() {
    if (window.location.hash == '#new') {
        $('#new').fadeIn('slow');
        window.location.hash = '';
        window.setTimeout(function() {
            $('#new').fadeOut('slow');
        }, 4000)
    }
}


// fmonth is function that, creating a dinamics dates, in the wiev(site)
function fmonth(f) {
    //Array aMonth for take moths from JSON
    var aMonth = [];
    // Array de que se genera de la fecha
    var aDate = []; 
    var parent = document.getElementById("ul_menu_month");
     
    //Take only month from date in googlespretsheet dd/MM/yyyy
    _.each(f, function (value, key) {
        aDate = f[key].properties.date.split("/");
        aMonth.push(aDate[1]);//Push month in array aMoth
    });
   
    aMonth = _.uniq(aMonth);
    aMonth=aMonth.sort();
 
    //Create a tag "li" and  "a" with "id=aMonth[i]" for menu month in the view
    for (var i = 0; i< aMonth.length; i++) {
        var new_li = document.createElement("li");

        new_li.innerHTML = '<a href= \'#\'  id=\''+aMonth[i]+'\' > ' + 
        monthNames[aMonth[i]-1]+ '</a>';

        parent.appendChild(new_li);

    }
}

//Get data from spreadsheet "resumen"
mmg_google_docs_spreadsheet_2(data_id, statisticData );

//Function to get all data from spreadsheet
function statisticData(f){
    features_summary=f;

    _.each(f, function (value, key) {
        a_tipo_incidente.push(f[key].properties.tipo_incidente);
        a_cantidad_type.push(f[key].properties.cantidad_type);
        a_cantjanuary.push(f[key].properties.cantjanuary);
        a_cantfebruary.push(f[key].properties.cantfebruary);
        a_cantmarch.push(f[key].properties.cantmarch);
        a_cantapril.push(f[key].properties.cantapril);
        a_canmay.push(f[key].properties.canmay);
        a_cantjune.push(f[key].properties.cantjune);
        a_cantjuly.push(f[key].properties.cantjuly);
        a_cantaugust.push(f[key].properties.cantseptember);
        a_cantseptember.push(f[key].properties.cantmarch);
        a_cantoctober.push(f[key].properties.cantoctober);
        a_cantnovember.push(f[key].properties.cantnovember);
        a_cantdecember.push(f[key].properties.cantdecember);

    });
}

//Call the  fuction from  google chart API,  for create main statistic box
google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(draw_main_box);

//Function for draw the main statistic box
function draw_main_box() {
    var data = new google.visualization.DataTable(),
        options = { backgroundColor: 'transparent', colors:['#CB3334', '#FFCC33','#653332','#CC6633','#666535','#222222'] },
        chart = new google.visualization.PieChart(document.getElementById('img_total_percentage'));

    data.addColumn('string', 'Incidencias');
    data.addColumn('number', 'Porcentaje');
    data.addRows([
        [a_tipo_incidente[0], parseInt(a_cantidad_type[0],10)],
        [a_tipo_incidente[1], parseInt(a_cantidad_type[1],10)],
        [a_tipo_incidente[2], parseInt(a_cantidad_type[2],10)],
        [a_tipo_incidente[3], parseInt(a_cantidad_type[3],10)],
        [a_tipo_incidente[4], parseInt(a_cantidad_type[4],10)],
        [a_tipo_incidente[5], parseInt(a_cantidad_type[5],10)]
    ]);           
   
    chart.draw(data, options);
    
    //Put the  total number incident on the view
    $('#num-incident').html('Total de puntos registrados : '+a_cantidad_type[6]); 
    //Delete loading gif      
    $('#block_statistic').removeClass('loading');
}



//Function to draw line for  all incidents  
function draw_all_incedent() {
    var data = google.visualization.arrayToDataTable([]);
    var options = {title: 'GRAFICO DE LINEA DEL TOTAL DE INCIDENCIAS',
        hAxis: {title: 'Meses',   titleTextStyle: {color: 'red'}, textStyle:{color: '#333' , fontSize: 11}},
        vAxis: {title: 'Cantidad',   titleTextStyle: {color: 'red'}},
        gridlines:{color: '#333', count: 5},         
        backgroundColor: 'transparent'
    };
    var chart = new google.visualization.LineChart(document.getElementById("all_incident_type_statistic"));

    data.addColumn('string', 'Mes');
    data.addColumn('number', 'Total');
    data.addRows([
        ['Enero', a_cantjanuary[6]],
        ['Febrero', a_cantfebruary[6]],
        ['Marzo', a_cantmarch[6]],
        ['Abril',a_cantapril[6]],
        ['Mayo',a_canmay[6]],
        ['Junio',a_cantjune[6]],
        ['Julio',a_cantjuly[6]],
        ['Agosto',a_cantaugust[6]],
        ['Septiembre',a_cantseptember[6]],
        ['Octubre',a_cantoctober[6]],
        ['Noviembre',a_cantnovember[6]] 
    ]);

    chart.draw(data, options);
}

//Function to draw  line by type of incidents  
function draw_type_incedent(id_x,i) {            
    var data = google.visualization.arrayToDataTable([]);
    var options = {
        title: ' GRAFICO DE LINEA DE TIPO DE INCIDENCIA - '+id_x.replace('_statistic',"").replace('_'," ").replace('_'," ").toUpperCase(),
        hAxis: {title: 'Meses',   titleTextStyle: {color: 'red'}, textStyle:{color: '#333' , fontSize: 11}},
        vAxis: {title: 'Cantidad',   titleTextStyle: {color: 'red'}},
        gridlines:{color: '#333', count: 4},         
        backgroundColor: 'transparent'
    };
    var chart = new google.visualization.LineChart(document.getElementById(id_x));

    data.addColumn('string', 'Mes');
    data.addColumn('number', 'Cantidad');
    data.addRows([
        ['Enero', a_cantjanuary[i]],
        ['Febrero', a_cantfebruary[i]],
        ['Marzo', a_cantmarch[i]],
        ['Abril',a_cantapril[i]],
        ['Mayo',a_canmay[i]],
        ['Junio',a_cantjune[i]],
        ['Julio',a_cantjuly[i]],
        ['Agosto',a_cantaugust[i]],
        ['Septiembre',a_cantseptember[i]],
        ['Octubre',a_cantoctober[i]],
        ['Noviembre',a_cantnovember[i]]
    ]);       
    chart.draw(data, options);
}

//Function to put href  for download data
function download_data() {
    $('#download_csv').attr('href','https://docs.google.com/a/developmentseed.org/spreadsheet/pub?key='+data_id+'&output=csv');
    $('#download_josn').attr('href','https://spreadsheets.google.com/feeds/list/'+data_id+'/od6/public/values?alt=json-in-script');
}

function indicateMenuIncident() {
    var show_text='',
        type_incident=$('#' + $('#ul_menu_type_incident .active').attr('id')).text(),
        month_incident=$('#' + $('#ul_menu_month li .active').attr('id')).text();

    if (type_incident=='Mostrar Todos' && month_incident=='Todos') {
        $('#indicate_menu').html('<p>Todos los incidentes registrados </p>');
    } else if (type_incident !='Mostrar Todos' && month_incident =='Todos') {
        $('#indicate_menu').html('<p>' + type_incident + ' de todos los meses</p>');
    } else {
        if (type_incident=='Mostrar Todos') {
            type_incident='Todos los Incidentes';
        }
        if (month_incident=='Todos') {
            month_incident='Todos los Meses';
        }

        $('#indicate_menu').html('<p>' + type_incident + ' del Mes ' + month_incident + '</p>');
    }

}

// Document already
$(document).on('ready',function() {
    // Get event click on menu month
    $('#ul_menu_month').on('click', 'li', function (e) {
        var id_event_month=e.target.id;
        //Gentralizing the map
        map.ease.location({ lat: -13.16039, lon: -74.22574}).zoom(14).optimal();

        //Gheck if click is on all incidents
        if (id_event_month == "all_incident_month") {
            //Renove all active class 
            $('#ul_menu_month li a').removeClass('active');
            //Put in here the active clas
            $('#'+id_event_month).addClass('active');
            indicateMenuIncident();

            if ($('#ul_menu_type_incident .active').attr('id') != 'all_incident_type') {
                markerLayer.filter(function (features) {
                    if(features.properties['title'].replace(/\s/g,"_")== $('#ul_menu_type_incident .active').attr('id'))
                    return true;                    
                });
            } else {
                markerLayer.filter(function (features) {
                    // Returning true for all markers shows everything.
                    return true;
                });
                
                return false;
            }    

        } else {
            //Check if on menu type incident is active option "Todos Incidentes" with id=all_incident_type 
            if ($('#ul_menu_type_incident .active').attr('id') == "all_incident_type") {
                $('#ul_menu_month li a').removeClass('active');
                $('#'+id_event_month).addClass('active');
                indicateMenuIncident();
                //Here classified by date all incidente
                markerLayer.filter(function (features) { 
                    //Create arraydate and this get month from data JSON
                    var arraydate = features.properties['date'].split("/");

                    if (arraydate[1]== id_event_month)
                        return true;                                                      
                });
            } else {
                $('#ul_menu_month li a').removeClass('active');
                $('#'+id_event_month).addClass('active');
                indicateMenuIncident();
                //Here classified by date and by type of incidente
                markerLayer.filter(function (features) { 
                    var arraydate = features.properties['date'].split("/");
                    //Conditional double .. incident type and date
                    if (arraydate[1] == e.target.id && features.properties.title.replace(/\s/g,"_") == $('#ul_menu_type_incident .active').attr('id'))
                        return true;                    
                });
            }
            
            return false;         
        }
        
    });


    //Get the click on button for to show block line statistic
    $('#arrow_show_block a').on('click',function (e) {
        $('.statistic_by_month').css('display','block');
        $('#close_block_stac').show(200);
        $('#arrow_show_block').css('backgroundColor','#ccc');

        var id_active_type=$('#ul_menu_type_incident .active').attr('id');

        //Check on menu type incident is active for show  and draw line for box static all incident
        if (id_active_type == 'all_incident_type') {
            //Call the  function from  google chart API,  for create line statistic for all incident
            $('.statistic_by_month').attr('id','all_incident_type_statistic');
            draw_all_incedent();
            google.setOnLoadCallback(draw_all_incedent);

        } else {
            //Here to get on menu type incident which is active for draw an show
            var name_active_tipe=$('#ul_menu_type_incident .active').attr('name')-1;

            //Call the  function from  google chart API,  for create line statistic for type incident            
            draw_type_incedent(id_active_type+'_statistic',name_active_tipe);
            google.setOnLoadCallback(draw_type_incedent);
        }
          //Close other block  about tha definiction of incident
        $('.block_inf_type').css('display','none');
        $('#arrow_block_inf').css('background-color','#292929');
        $('#close_block_inf').css('display','none');

    });


    // Get event click on menu type incident
    $('#ul_menu_type_incident li').click(function (e) {
        var id_event_type=e.target.id;

        //Centralizing the map
        map.ease.location({ lat: -13.16039, lon: -74.22574}).zoom(15).optimal();

        //Check is is active on menu type "Mostrar Todos "
        if (id_event_type == 'all_incident_type') {
            $('#ul_menu_type_incident li a').removeClass('active');
            $('#'+id_event_type).addClass('active');
            indicateMenuIncident();

           //Check to enable block where statistics show a month
            if ($('.close_block_stac').css('display') == 'block') {//esto estyo comentando
                $('.statistic_by_month').attr('id','all_incident_type_statistic');
                //Draw the graphics statistic
                draw_all_incedent();
                google.setOnLoadCallback(draw_all_incedent);
            }        

            if ($('#ul_menu_month .active').attr('id') !='all_incident_month') {
                markerLayer.filter(function (features) {
                    var arraydate = features.properties['date'].split("/");
                    //Here classified by type of incidente and  by date (month)
                    if(arraydate[1] == $('#ul_menu_month .active').attr('id'))
                        return true;                    
                });

            } else {
                markerLayer.filter(function (features) {
                    // Returning true for all markers shows everything.
                    return true;
                });
                return false;
            }

        } else {
            //Check if is active in menu month "Todos" 
            if ($('#ul_menu_month .active').attr('id') == "all_incident_month") {
                $('#ul_menu_type_incident li a').removeClass('active');
                $('#'+id_event_type).addClass('active');
                indicateMenuIncident();

                markerLayer.filter(function (features) {
                    // Replace the blanks with subindent and compared with the ID    
                    if(features.properties['title'].replace(/\s/g,"_") == id_event_type)                    
                        return true;  
                });  

            } else {
                $('#ul_menu_type_incident li a').removeClass('active');
                $('#'+id_event_type).addClass('active');
                indicateMenuIncident();

                markerLayer.filter(function (features) {
                    var arraydate = features.properties['date'].split("/");
                    //Here classified by type of incidente and  by date (month)
                    if(features.properties['title'].replace(/\s/g,"_") == id_event_type && arraydate[1] == $('#ul_menu_month .active').attr('id'))
                    return true;                    
                });
            }

            // Check to enable block where statistics show a month
            if ($('#close_block_stac').css('display')=='block') {
                $('.statistic_by_month').css('display' , 'block');
                //Hide box  close in statistic
                $("#close_block_stac").show(200);
            } else {
                $('.statistic_by_month').css('display' , 'none');
                 $('#close_block_stac').hide(200);
            }

            //Add an id to display the image example id=Robo_statistic
            $('.statistic_by_month').attr('id',id_event_type + '_statistic');

            //Take to attribute name, is important to show, which data we want to show
            var number_name = $('#'+id_event_type).attr('name') - 1;
            //Draw the graphics statistic by type of incident
            draw_type_incedent(id_event_type+'_statistic',number_name);
            google.setOnLoadCallback(draw_type_incedent);           
            return false;         
        }
    });



    ///For show and close the superposition bloc about Open Data and How To 
    $('a[href="#opendata"]').click(function (e) {
        e.preventDefault();
        $('#backdrop').fadeIn(200);
        $('#opendata').show(200);
        $('#close').show(200);
    });

    $('a[href="#howto"]').click(function (e) {
        e.preventDefault();
        $('#backdrop').fadeIn(200);
        $('#howto').show(200);
        $('#close').show(200);
    });

     $('#close').click(function (e) {
        e.preventDefault();
        $('#backdrop').fadeOut(200);
        $('#opendata').hide(200);
        $('#howto').hide(200);
        $('#close').hide(200);
    });

     //Get the click  to show block about definition of incident
    $('#arrow_block_inf').click(function (e) {
        e.preventDefault();
        $('.block_inf_type').css('display','block');
        $('#close_block_inf').show(200);
        $('#arrow_block_inf').css('background-color','#ccc');       
        $('.statistic_by_month').css('display','none');
        $('#arrow_show_block').css('background-color','#292929');
        $$('#close_block_stac').css('display','none');

    });

    //Get the click to close block about definition of incident
    $('#close_block_inf').click(function (e) {
        e.preventDefault();
        $('#arrow_block_inf').css('background-color','#292929') ;          
        $('.block_inf_type').css('display','none');
        $('#close_block_inf').hide(200);
    });
 
    //Get the click to close block statistic line
    $('#close_block_stac').click(function() {
        $(this).hide(200);
        $('.statistic_by_month').css('display','none');
        $('#arrow_show_block').css('display','block');
        $('#arrow_show_block').css('background-color','#292929') ;
    });

});



