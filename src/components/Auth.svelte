
<script>
    import { authHandlers, authStore } from "../stores/authStore";
    let register = false;
    let email = '';
    let password = '';
    let confirmPassword = '';

    async function handleSubmit () {
        if(!email || !password && (register && !confirmPassword)){
            return
        }

        if(register && password === confirmPassword){
            try {
               await authHandlers.signup(email, password)
            } catch (err){
                console.log(err)
            }
        } else {
            try {
               await authHandlers.login(email, password)
            } catch (err){
                console.log(err)
            }
        }
        if ($authStore.currentUser){
            window.location.href='/privatedashboard';
        }
    }
</script>

<div class="container">
    <h1>Terra</h1>
    <h3>{register ? 'Register' : 'Log In'}</h3>
    <form>
        <label>
            <input bind:value={email} type="email" placeholder="Email"/>
        </label>
        <label>
            <input bind:value={password} type="password" placeholder="Password"/>
        </label>
        {#if register}
        <label>
            <input bind:value={confirmPassword} type="password" placeholder="Confirm Password"/>
        </label>
        {/if}
        <button on:click={handleSubmit}>Submit</button>
    </form>
    {#if register}
    <div class="hi" on:click={() =>{
        register = false;
    }} on:keydown={() => {}}>Already have an account?</div>

    {:else}
    <div class="hi" on:click={() =>{
        register = true;
    }} on:keydown={() => {}}>Don't Have an account?</div>
    {/if}
</div>

<style>

    .hi {
        color: white;
        font-size: 20px;
        margin: auto;
        margin-top: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    .hi:hover {
        color: #D3D3D3;
    }

    h1 {
        margin-top: 70px;
        margin-bottom: 70px;
		color: #08b455;
		text-transform: uppercase;
		font-size: 110px;
		font-weight: 200;
	}

    h3 {
        color: #D3D3D3;
        font-size: 50px;
        margin: auto;
        margin-bottom: 20px;
        font-family: Helvetica, Arial, sans-serif;
        font-weight: 100px;
    }

    input {
        margin-top: 5px;
        margin-bottom: 5px;
        margin-left: -5%;
        width: 110%;
        border-radius: 6px;
        font-size: 22px;
        padding: 4px;
        color: #3D3D3D;
        border: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    input:focus {
        outline: none;
        border: 3.5px solid #08b455;
    }

    button {
        margin-top: 15px;
        color: white;
        background-color: #08b455;
        border-radius: 8px;
        font-size: 20px;
        padding: 7px;
        border: none;
        width: 60%;
        margin-left: 20%;
        transition-duration: 0.4s;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    button:hover {
        background-color: white; /* Green */
        color: #08b455;
        border: 2px #08b455;
    }

    :global(body) {
		background-color: #1d3040;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
	}

    .container{
        display: grid;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
    }

    .container form{
        display: flex;
        flex-direction: column;
    }
</style>