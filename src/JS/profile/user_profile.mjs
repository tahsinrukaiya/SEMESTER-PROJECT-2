import { API_BASE } from "../constants.mjs";
import { API_PROFILE } from "../constants.mjs";
import { loadStorage } from "../storage/local_storage.mjs";
import { API_KEY } from "../constants.mjs";

const main_container = document.getElementById('main_container');

// Retrieve the user_profile object from local storage
export const userProfile = loadStorage('user_profile');

export async function get_profile_data() {
    if (userProfile) {
        const userName = userProfile.userName;
        const userEmail = userProfile.userEmail;
        const userAvatar = userProfile.userAvatar;
        const token = JSON.parse(localStorage.getItem('token'));

        if (!token) {
            main_container.innerHTML = `<p>No logged in user found</p>`;
            return;
        }

        try {
            const response = await fetch(`${API_BASE}${API_PROFILE}${userName}?_listings=true&_wins=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": API_KEY
                },
            });

            if (!response.ok) {
                // More details about the error returned by the server
                const errorText = await response.text();
                console.error("Error from server:", errorText);
                throw new Error("Network Issue");
            } else {
                console.log("Profile data loading successful!");
            }

            const profile_data = await response.json();
            // Construct the HTML content
            main_container.innerHTML = `<div class="row pb-5">
            <div class="col">
                <h3 class="text-center mt-5 heading">Profile</h3>
                <div class="card mt-5 text-center profile_card">
                    <img class="card-img-top rounded-pill profile_photo" src="${profile_data.data.avatar.url}" alt="${profile_data.data.avatar.alt}">
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-primary rounded-pill update_profile" id="update_profile" data-bs-toggle="modal" data-bs-target="#update_profile_modal">
                     Update Profile
                    </button>
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
        </div>   
        <div class="modal fade" id="update_profile_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Change your avatar</h5>
                        <button type="button" class="btn-close rounded-pill" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <form class="update_profile_form" id="update_profile_form">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label url">Avatar url</label>
                        <input type="url" class="form-control rounded-pill avatar_input" id="avatar_input" />
                    </div>
                    <button type="submit" class="btn rounded-pill  border update_avatar_btn">Update
                        Avatar</button>
                </form>
                    </div>
                </div>
            </div>
        </div>     
        `;

        } catch (error) {
            console.log(error);
        }
    } else {
        main_container.innerHTML = `<p>No logged in user found</p>`;
    }
}

get_profile_data();
