<script lang="ts">
	//import { goto } from "$app/navigation";
    //import { base } from '$app/paths';
    import PopupStart from "./popupStart.svelte";    
    import './styles.css';
    //import { getAgreementStatus } from './consentAgreement';

    // function OnClickNavigate()
    // {
    //     console.log("Confirm Button Clicked");
    //     if (getAgreementStatus())
    //         goto(`${base}/Homescreen`, {noScroll:false});
    //     else
    //         alert("Agreement has not been accepted. Please accept the agreement to access the application");
    // }

    // function OnClickNavigateExitScreen()
    // {
    //     console.log("Exit Screen Button Clicked");
    //     goto(`${base}/Exitscreen`, {noScroll:false});
    // }

</script>

<h1> Hello, please accept the Agreement to start Testing</h1>

<PopupStart></PopupStart>
