import { API_PROFILE } from "../constants.mjs";
import { loadStorage } from "../storage/local_storage.mjs"

const main_container = document.getElementById('main_container');

// Retrieve the user_profile object from local storage
const userProfile = loadStorage('user_profile');

// Check if userProfile exists and has the required properties
if (userProfile && userProfile.userName && userProfile.userEmail && userProfile.userAvatar) {
    // Access the userName, userEmail, and userAvatar properties
    const userName = userProfile.userName;
    const userEmail = userProfile.userEmail;
    const userAvatar = userProfile.userAvatar;

    main_container.innerHTML = `
<div class="row pb-5">
    <div class="col">
        <h3 class="text-center mt-5">Your Profile</h3>
        <div class="card mt-5 text-center profile_card">
            <img class="card-img-top rounded-circle profile_photo" src=${userAvatar.url} alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${userName}</h5>
                <p class="card-text">${userEmail}</p>
                <a href="#" class="btn rounded-pill profile_edit" id= "profile_edit">Edit Profile</a>
            </div>
        </div>
    </div>
    <div class="col listing_col" id="listing_col">
        <h3 class="text-center mt-5 "> Your Listing</h3>
        <h6 class="listing_text">Ongoing:</h6>
        <h6 class="listing_text"> Won:</h6>
        <h6 class="listing_text"> Ended:</h6>
        <h6 class="listing_text">Credits: </h6>

    </div>
</div>`;
} else {
    console.error('User profile data is incomplete or missing');
}




