import { API_BASE } from "../constants.mjs";
import { API_PROFILE } from "../constants.mjs";
import { loadStorage } from "../storage/local_storage.mjs"
import { API_KEY } from "../constants.mjs";

const main_container = document.getElementById('main_container');

// Retrieve the user_profile object from local storage
const userProfile = loadStorage('user_profile');
console.log(userProfile);

export async function get_profile_data() {
    if (userProfile) {
        const userName = userProfile.userName;
        const userEmail = userProfile.userEmail;
        const userAvatar = userProfile.userAvatar;
        console.log(userName);
        console.log(userEmail);
        console.log(userAvatar);
        const token = JSON.parse(localStorage.getItem('token'));

        try {
            const response = await fetch((`${API_BASE}${API_PROFILE}${userName}?_listings=true&_wins=true`), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": API_KEY
                },

            });
            if (!response.ok) {
                //more details about the error returned by the server
                const errorText = await response.text();
                console.error("Error from server:", errorText);
                throw new Error("Network Issue");
            }
            else {
                console.log("Profile data loading successful!");
            }

            const profile_data = await response.json();
            console.log(profile_data);
            // Construct the HTML content
            main_container.innerHTML = `<div class="row pb-5">
            <div class="col">
                <h3 class="text-center mt-5 heading">Profile</h3>
                <div class="card mt-5 text-center profile_card">
                    <img class="card-img-top rounded-pill profile_photo" src="${profile_data.data.avatar.url}" alt="${profile_data.data.avatar.alt}">
                    <a href="#" class="edit_avatar" id="edit_avatar">
                    <button type="button" class="btn btn-sm rounded-pill px-3 update_avatar" id="update_avatar">Update Avatar</button>
                    </a>
                    <div class="card-body">
                    <h2>${profile_data.data.name}</h2>
                    <p>Email: ${profile_data.data.email}</p>
                    <p>Credits: ${profile_data.data.credits}</p>
                    <p>Listings: ${profile_data.data._count.listings}</p>         
                    </div>
                </div>
            </div>
            <div class="col listing_col" id="listing_col">
                <h3 class="text-center mt-5"> Your Listing</h3>
                <h6 class="listing_text">Ongoing:</h6>
                <h6 class="listing_text"> Won:  ${profile_data.data._count.wins}</h6>
                <h6 class="listing_text"> Ended:</h6>
                <h6 class="listing_text">Credits: </h6>
            </div>
        </div>`;

        }

        catch (error) {
            console.log(error);
        }
    }
}

get_profile_data();

