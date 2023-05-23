<script>
    import { auth } from "../../lib/firebase/firebase.client";
    import { authStore } from "../../stores/authStore";
    import { authHandlers } from "../../stores/authStore";
    import { browser } from '$app/environment';

    let email;
    authStore.subscribe(curr => {
        email = curr?.currentUser?.email
    })

    let address = "";

    let show = false;
    let north = false;
    let latnum;
    let lonnum;
    let addy;
    let url;
    let wm, t, wd;

    async function run(){

        show = !show;
        if(show){
            address = document.getElementById("searchInput").value;

            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyD5XKxfmrK8OF0wcW4ckZpPY2U8ox8g53U`)
            .then((response) => {
                return response.json();
            }).then(jsonData => {
                console.log(jsonData.results[0].geometry.location.lat);
                console.log(jsonData.results[0].geometry.location.lng); 
                latnum = jsonData.results[0].geometry.location.lat;
                lonnum = jsonData.results[0].geometry.location.lng;
                addy = jsonData.results[0].formatted_address;
                if(latnum<35){
                    north=false;
                }else{
                    north=true;
                }
                console.log(`north is ${north}`);
            })
            .catch(error => {
                console.log(error);
            })
            
            setTimeout(function(){
                //call weather api
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${latnum}&lon=${lonnum}&appid=00f803d4272a03c80c53d1b0b328dbc5`;
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
            }, 500);
            
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
    <h2>Welcome To Terra. <br>Please Type In a City Where You Would Like To Grow Crops!</h2>
		<!-- Search input -->
		<input id="searchInput" class="controls" type="text" placeholder="Enter a location">

		<!-- Google map -->
		<div id="map"></div>

		<!-- Display geolocation data -->
		<ul class="geo-data">
            {#if show}
            <li>Full Address: {addy} </li>
    		<li>Latitude: {latnum}</li>
    		<li>Longitude: {lonnum}</li>
            {/if}
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
                {#if north}
                <li class="crop">Sweet Corn<p class="words">The top crop in the Midwest!</p></li>
                <li class="crop">Green Beans<p class="words">Who doesn't love some green beans!</p></li>
                <li class="crop">Apples<p class="words">Red, Yellow, Green - <br>Your choice!</p></li>
                {:else}
                <li class="crop">Cotton<p class="words">Yay soft clothes!</p></li>
                <li class="crop">Wheat<p class="words">Oats, grain, and barley as well!</p></li>
                <li class="crop">Peanuts<p class="words">Peanut Butter -<br> Woohoo!</p></li>
                {/if}
            </ul>
        </section>
        {/if}
        
{#if $authStore.currentUser}
    <div>
       <button class="btn" on:click={authHandlers.logout}>Logout</button>
    </div>
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
        list-style-type: none;
        color: white;
        font-size: 18px;
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
        font-size: 18px;
	}

    li {
        margin-top: 8px;
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