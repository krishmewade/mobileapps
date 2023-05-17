<script>
    import { auth } from "../../lib/firebase/firebase.client";
    import { authStore } from "../../stores/authStore";
    import { authHandlers } from "../../stores/authStore";


    let email;
    authStore.subscribe(curr => {
        email = curr?.currentUser?.email
    })

    
</script>

<main>
{#if $authStore.currentUser}
    <div>
       <h3>Welcome {email}</h3>
       <button on:click={authHandlers.logout}>Logout</button>
    </div>
{:else}
<div>Loading...</div>
{/if}

<h1>Terra</h1>
<body>
    <h2>Welcome to Terra. <br>Please type in the location of where you would like to grow crops</h2>
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
</body>
</main>

<style>
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
    }

    h2{
		color: rgb(201, 199, 199);
	}

    h1 {
		color: #08b455;
		text-transform: uppercase;
		font-size: 80px;
		font-weight: 200;
	}

    ul {
		list-style-type: none;
        color: white;
	}

    p{
		color: white;
	}

    :global(body) {
		background-color: #1d3040;
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