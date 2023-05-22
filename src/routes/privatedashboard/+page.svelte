<script>
    import { auth } from "../../lib/firebase/firebase.client";
    import { authStore } from "../../stores/authStore";
    import { authHandlers } from "../../stores/authStore";
    import { browser } from '$app/environment';

    let email;
    authStore.subscribe(curr => {
        email = curr?.currentUser?.email
    })

    function initMap() {
			var map = new google.maps.Map(document.getElementById('map'), {
			  center: {lat: -33.8688, lng: 151.2195},
			  zoom: 13
			});
			var input = document.getElementById('searchInput');
			map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		
			var autocomplete = new google.maps.places.Autocomplete(input);
			autocomplete.bindTo('bounds', map);
		
			var infowindow = new google.maps.InfoWindow();
			var marker = new google.maps.Marker({
				map: map,
				anchorPoint: new google.maps.Point(0, -29)
			});
		
			autocomplete.addListener('place_changed', function() {
				infowindow.close();
				marker.setVisible(false);
				var place = autocomplete.getPlace();
				if (!place.geometry) {
					window.alert("Autocomplete's returned place contains no geometry");
					return;
				}
		  
				// If the place has a geometry, then present it on a map.
				if (place.geometry.viewport) {
					map.fitBounds(place.geometry.viewport);
				} else {
					map.setCenter(place.geometry.location);
					map.setZoom(17);
				}
				marker.setIcon(({
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(35, 35)
				}));
				marker.setPosition(place.geometry.location);
				marker.setVisible(true);
			
				var address = '';
				if (place.address_components) {
					address = [
					  (place.address_components[0] && place.address_components[0].short_name || ''),
					  (place.address_components[1] && place.address_components[1].short_name || ''),
					  (place.address_components[2] && place.address_components[2].short_name || '')
					].join(' ');
				}
			
				infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
				infowindow.open(map, marker);
			  
				// Location details
				for (var i = 0; i < place.address_components.length; i++) {
					if(place.address_components[i].types[0] == 'postal_code'){
						document.getElementById('postal_code').innerHTML = place.address_components[i].long_name;
					}
					if(place.address_components[i].types[0] == 'country'){
						document.getElementById('country').innerHTML = place.address_components[i].long_name;
					}
				}
				document.getElementById('location').innerHTML = place.formatted_address;
				document.getElementById('lat').innerHTML = place.geometry.location.lat();
				document.getElementById('lon').innerHTML = place.geometry.location.lng();
			});
		}

    let show = false;
    let latnum;
    let lonnum;
    let url;
    let wm, t, wd;

    async function run(){
        latnum = document.getElementById('lat').innerHTML
        lonnum = document.getElementById('lon').innerHTML

        show = !show;
        if(show){
            console.log(latnum);
            console.log(lonnum);
            //call weather api
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${latnum}&lon=${lonnum}&appid=00f803d4272a03c80c53d1b0b328dbc5`;
            console.log(url);
            fetch(url)
            .then(response => response.json())
            .then(data => {
                // do stuff with the data 
                let { main, name, sys, weather } = data;
                t = main.temp;
                t = ((t-273)*9/5+32).toFixed(1);
                wm = weather[0]["main"];
                wd = weather[0]["description"];

            })
            .catch(() => {
            });
        }
    }

    
</script>

<main>
{#if $authStore.currentUser}
    <div>
       <h3>Welcome {email}!</h3>
    </div>
{:else}
<div>Loading...</div>
{/if}

<h1>Terra</h1>
<body>
    <h2>Welcome to Terra <br>Please type in the location of where you would like to grow crops</h2>
		<!-- Search input -->
		<input id="searchInput" class="controls" type="text" placeholder="Enter a location">

		<!-- Google map -->
		<div id="map"></div>

		<!-- Display geolocation data -->
		<ul class="geo-data">
    		<li>Full Address: <span id="location"></span></li>
   		 	<li>Country: <span id="country"></span></li>
    		<li>Latitude: <span id="lat"></span></li>
    		<li>Longitude: <span id="lon"></span></li>
		</ul>

        <button on:click={run}>
            {#if show}
            Return
            {:else}
            Submit
            {/if}  
        </button>
        {#if show}
            <p>The temperature in your area is {t} degrees Fahrenheit</p>
            <p>The weather in your area is {wm} with {wd}</p>
            <br>
        {/if}
        {#if show}
        <section class="sec">
            <ul class="crops">
                <li class="crop">Crop 1<p class="words">Description 1</p></li>
                <li class="crop">Crop 2<p class="words">Description 2</p></li>
                <li class="crop">Crop 3<p class="words">Description 3</p></li>
            </ul>
        </section>
        {/if}
        
{#if $authStore.currentUser}
    <div>
       <button class="btn" on:click={authHandlers.logout}>Logout</button>
    </div>
{/if}
{#if browser}
    <script src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyD5XKxfmrK8OF0wcW4ckZpPY2U8ox8g53U"></script>
    <script src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyD5XKxfmrK8OF0wcW4ckZpPY2U8ox8g53U&callback=initMap" async defer></script>
{/if}
</body>
</main>

<style>
    .sec .crops {
        display: grid;
        text-align: center;
        margin-left: 5%;
        width: 120%;
        grid-gap: 100px 20px;
        grid-template-columns: repeat(4, 1fr);
    }

    .sec .crop {
        position: relative;
        padding: 30px 10%;
        border-radius: 20px;
        background: #fff;
        color: #1e2432;
        font-size: 20px;
    }

    .words {
        margin-top: 15px;
        font-size: 15px;
        color: #53627c;
    }
    div {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    h3{
        text-align: center;
        color: white;
        font-size: 20px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    p{
        color: white;
    }

    input {
        margin-top: 15px;
        margin-bottom: 15px;
        margin-left: 0;
        width: 40%;
        border-radius: 6px;
        font-size: 18px;
        padding: 4px;
        color: #3D3D3D;
        border: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    h2{
		color: rgb(201, 199, 199);
	}

    button {
        margin-top: 15px;
        margin-bottom: 15px;
        color: white;
        background-color: #08b455;
        border-radius: 8px;
        font-size: 20px;
        padding: 7px;
        border: none;
        width: 20%;
        margin-left: 0;
        transition-duration: 0.4s;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    button:hover {
        background-color: white; /* Green */
        color: #08b455;
        border: 2px #08b455;
    }

    .btn{
        background-color: white;
        color: #08b455;
        width: 15%;
        font-size: 16px;
        padding: 5px;
    }

    .btn:hover {
        background-color: #08b455; /* Green */
        color: white;
        border: 2px white;
    }

    h1 {
        margin-top: 50px;
        margin-bottom: 60px;
		color: #08b455;
		text-transform: uppercase;
		font-size: 110px;
		font-weight: 200;
	}

    ul {
		list-style-type: none;
        color: white;
	}

    :global(body) {
		background-color: #1d3040;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
	}

    main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

    @media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>