// custom js
var MAPS_API_KEY = 'AIzaSyBuSeH7ueeVuaJs03xIwjtd7hbmShWZ_ew';
var OS_API_KEY = '2adfa609-63df-4a8d-bd7c-a243ec2b873f';

(function ($) {
    $('.action-info').hide();
    $( '.action-title' ).click(function() {
        $(this).next('.action-info').toggle();
    });
    // fix nav on scroll
    // $(window).scroll(function(e){
    //     var $el = $('#branding');
    //     var isPositionFixed = ($el.css('position') == 'fixed');
    //     if ($(this).scrollTop() > 200 && !isPositionFixed){
    //         $('#branding').css({'position': 'fixed', 'top': '0px'});
    //     }
    //     if ($(this).scrollTop() < 200 && isPositionFixed)
    //     {
    //         $('#branding').css({'position': 'static', 'top': '0px'});
    //     }
    // });

    $("button.take-action").on("click", function() {
      $('#take-action').hide();
      if (!logged_in) {
        $("#findYourRepModal").modal();
      } else {
        lookupLegislators(loc["lat"], loc["lng"]);
        $("#makeACallModal").modal();
      }
    });
    $("a#find-your-rep").on("click", function() {
      $('.modal').modal('hide');
      $("#findYourRepModal").modal('show');
    });

    $("form[name=address]").on( "submit", function( event ) {
      event.preventDefault();
      $('#findYourRepModal').modal('hide');
      $('#makeACallModal').modal('show');
      var address = $("#street").val() + " " + $("#city").val() + " " + $("#state").val();
      var city = $("#city").val() + " " + $("#state").val();
      $.ajax({
        // Geocode the user's address
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + MAPS_API_KEY,
        type: "GET",
        dataType: "json",
        success: function (result) {
          loc = result.results[0].geometry.location;
          console.log(loc);
          // Get the location of the user's city
          // We'll use this for posting light markers on the map
          $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&key=' + MAPS_API_KEY,
            type: "GET",
            dataType: "json",
            success: function (result) {
              city_loc = result.results[0].geometry.location;
              console.log(city_loc);
            }
          });
          // Initialize call database
          //var database = firebase.database();
          lookupLegislators(loc["lat"], loc["lng"]);
        },
        error: function () {
            console.log('There was a problem with the request to geocode the address.');
        }
      });
    });

    // Click on the call button creates a new light
    $(document.body).on('click', '.phone .btn', function(){
      // Hide this button and show the reps phone number
      $(this).hide();
      $(this).siblings('.phone-number').show();
      var rep_name = $(this).parent().siblings('.name').html();

      // Create light node
      $.get('/rest/session/token', function(token) {
        $.ajax({
          method: "POST",
          url: "/entity/node?_format=json",
          contentType: "application/json",
          dataType: "json",
          headers: {
            "X-CSRF-Token": token
          },
          data: JSON.stringify({
            "langcode": [
              {
                "value": "en"
              }
            ],
            "type": [
              {
                "target_id": "light",
                "target_type": "node_type"
              }
            ],
            "title": [
              {
                "value": action_title
              }
            ],
            "default_langcode": [
              {
                "value": true
              }
            ],
            "body": [],
            "field_action": [
              {
                "target_id": action_nid,
                "target_type": "node"
              }
            ],
            "field_representative_text": [
              {
                "value": rep_name,
              }
            ],
            "field_map": [
                {
                  "lat": city_loc['lat'],
                  "lng": city_loc['lng']
                }
            ]
          })
        }).done( function(data) {
          console.log(data);
          console.log(data.nid[0].value);
          anonLights = JSON.parse(localStorage.getItem('anonymousLights'));
          if (!anonLights) { anonLights = [] };
          anonLights.push(data.nid[0].value);
          localStorage.setItem('anonymousLights', JSON.stringify(anonLights));
          var marker = new L.marker(loc, { riseOnHover: true }).addTo(map);
        });
      });

      // Display call counter
      /*
      var phone = $(this).data('phone');
      var callListRef = firebase.database().ref('calls');
      callListRef.push({'rep': phone });

      var calls = callListRef.equalTo(phone);
      starCountRef.on('value', function(snapshot) {
        updateStarCount(postElement, snapshot.val());
      });
      */
    });

    $(document.body).on('click', 'button.viewmap', function(){
      $('#makeACallModal').modal('hide');
      var zoom = 10;
      map.setView(loc, zoom, {pan: {animate: true}});
      $('#find-your-rep').hide();
      $('#join-and-share').show();
    });
    // Register a new account.
    // Then login to that account and patch any anonymous lights
    // that were created before the account was registered.
    $( "form[name=register]" ).on( "submit", function( event ) {
      event.preventDefault();
      $.get('/rest/session/token', function(token) {
        var name = $('form[name="register"] input[name="name"]').val();
        var email = $('form[name="register"] input[name="email"]').val();
        var password = $('form[name="register"] input[name="password"]').val();
        // Register the new account
        $.ajax({
          method: "POST",
          url: "/user/register?_format=json",
          contentType: "application/json",
          headers: {
            "X-CSRF-Token": token
          },
          data: JSON.stringify({
            "name": { "value": name },
            "mail": { "value": email },
            "pass": { "value": password },
            "field_location": [{
              "lat": JSON.stringify(loc["lat"]),
              "lng": JSON.stringify(loc["lng"])
            }],
            "field_city": [{
              "lat": JSON.stringify(city_loc["lat"]),
              "lng": JSON.stringify(city_loc["lng"])
            }]
          })
        }).success( function(data) {
          $.get('/rest/session/token', function(token) {
            // Login to the newly registered account
            $.ajax({
              url : "/user/login?_format=json",
              type : 'POST',
              contentType: "application/json",
              headers: {
                "X-CSRF-Token": token
              },
              data: JSON.stringify({
                'name' : name,
                'pass' : password,
              }),
              dataType : 'json',
              error : function(data) {
                console.log('Error ', data.responseText);
              },
              success : function(data) {
                console.log(data);
                console.log(data.current_user["uid"]);
                console.log(data.csrf_token);
                // Update any lights created before the account was registered
                for (node of JSON.parse(localStorage.getItem('anonymousLights'))) {
                  jQuery.ajax({
                    url: '/node/' + node + '?_format=json',
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-CSRF-Token': data.csrf_token
                    },
                    data: JSON.stringify({
                      "uid": [{
                        "target_id": data.current_user["uid"],
                        "target_type": "user"
                      }],
                      "type": [{
                        "target_id": "light"
                      }]
                    }),
                    success: function (node) {
                      console.log(node);
                      // Successful update
                      localStorage.setItem('anonymousLights', '');
                    }
                  });
                }
              }
            });
          });
        });
      });
    });
    // Prevent background scrolling when the modal is open.
    $('.modal').on('shown.bs.modal', function (e) {
      $('body').css('overflow','hidden');
    })
    $('.modal').on('hidden.bs.modal', function (e) {
      $('body').css('overflow','auto');
    })
    $('.map-overlay .close').on('click', function(e) {
      $('.map-overlay').hide();
    })

    function lookupLegislators(lat, lng) {
      $.ajax({
        // Lookup user's representatives
        url: 'https://openstates.org/api/v1/legislators/geo/?lat=' + lat + '&long=' + lng + '&apikey=' + OS_API_KEY,
        type: "GET",
        dataType: "jsonp",
        success: function (reps) {
          console.log(reps);
          $("#reps").empty();
          for (rep of reps) {
            var div = document.createElement('div')
            div.className = 'rep';
            var photo = document.createElement('div');
            console.log(rep.photo_url);
            photo.style.backgroundImage = 'url(' + rep.photo_url +')';
            photo.style.backgroundRepeat = 'no-repeat';
            photo.className = 'photo';
            div.appendChild(photo);
            var innerDiv = document.createElement('div');
            div.appendChild(innerDiv);
            var name = document.createElement('h3');
            name.innerHTML = rep.full_name;
            name.className = 'name';
            innerDiv.appendChild(name);
            var role = document.createElement('div');
            role.innerHTML = rep.party + (rep.chamber == 'lower' ? ' Representative ' : " Senator ") + 'for the ' + rep.district + ' District';
            role.className = 'role';
            innerDiv.appendChild(role);
            for (office of rep.offices) {
              if (office.phone) {
                var phone = document.createElement('div');
                phone.innerHTML = '<i class="fa fa-lg fa-fw ' + (office.name == 'Capitol office'? ' fa-university' : ' fa-map-marker') + '"></i><span class="office-name">' + office.name +':</span> <button type="button" class="btn btn-primary" data-phone="' + office.phone + '">Call now!</button><span class="phone-number"><a href="tel:' + office.phone + '">' + office.phone + '</a></span>';
                phone.className = 'phone';
                innerDiv.appendChild(phone);
              }
            }
            var website = document.createElement('div');
            website.innerHTML = '<i class="fa fa-user-circle-o fa-lg fa-fw"></i><a href="' + rep.url + '">Website</a>';
            website.className = "website";
            innerDiv.appendChild(website);

            $('#reps').append(div);
          };
          var viewmap = document.createElement('div');
          viewmap.className = 'viewmap';
          viewmap.innerHTML = '<p>Done calling? See your light on the map!</p><button type="button" class="btn btn-primary btn-lg viewmap">View Map</button>';
          $('#reps').append(viewmap);
        }
      });
    }
})(jQuery);


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
var action = getUrlParameter('action');
//console.log( action )
jQuery(document).ready(function($) {
    $("input[value=" + action + "]").prop('checked', true);
});
