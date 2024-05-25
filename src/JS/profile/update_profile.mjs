import { API_BASE, API_UPDATE_PROFILE, API_KEY } from "../constants.mjs";
import { userProfile } from "./user_profile.mjs";

console.log("User Profile:", userProfile);
const user_name = userProfile?.userName;
console.log("User Name:", user_name);

function addUpdateProfileListener(user_name, token) {
    const update_profile_form = document.getElementById('update_profile_form');

    if (!update_profile_form) {
        console.error("Update profile form not found");
        return;
    }

    update_profile_form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const avatar_url = document.getElementById('avatar_input').value;

        if (!avatar_url) {
            console.error("Avatar URL input is empty");
            return;
        }

        const updateProfileData = {
            avatar: avatar_url,
        };

        console.log("Update Profile Data:", updateProfileData);

        try {
            const url = `${API_BASE}${API_UPDATE_PROFILE}${user_name}`;
            console.log("Update Profile API URL:", url);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": API_KEY,
                },
                body: JSON.stringify(updateProfileData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error from server:", errorText);
                throw new Error("Network Issue");
            } else {
                console.log("Profile update successful!");
                const profile_card = document.getElementById('profile_card');
                if (profile_card) {
                    profile_card.innerHTML = `
                        <div class="card mt-5 text-center profile_card">
                            <img class="card-img-top" src="${avatar_url}" alt="Card image cap"></img>
                        </div>`;
                }
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    });
}

export async function initializeProfileUpdate() {
    const userName = userProfile?.userName; // Replace with actual user name
    const token = JSON.parse(localStorage.getItem('token')); // Replace with actual token

    if (!userName || !token) {
        console.error("Username or token not found in userProfile");
        return;
    }

    const main_container = document.getElementById('main_container');
    main_container.innerHTML = `
        <div class="row pb-5">
            <div class="col">
                <h3 class="text-center mt-5 heading">Profile</h3>
                <div class="card mt-5 text-center profile_card" id="profile_card">
                    <img class="card-img-top rounded-pill profile_photo" src="${userProfile.userAvatar}" alt="Card image cap">
                    <button type="button" class="btn btn-primary rounded-pill update_profile" id="update_profile" data-bs-toggle="modal" data-bs-target="#update_Profile_Modal">
                        Update Profile
                    </button>
                    <div class="card-body">
                        <h2>${userProfile.userName}</h2>
                        <p>Email: ${userProfile.userEmail}</p>
                        <p>Credits: ${userProfile.credits}</p>
                        <p>Listings: ${userProfile.listings}</p>
                    </div>
                </div>
            </div>
            <div class="col listing_col" id="listing_col">
                <h3 class="text-center mt-5">Your Listings</h3>
                <h6 class="listing_text">Ongoing:</h6>
                <h6 class="listing_text">Won: ${userProfile.wins}</h6>
                <h6 class="listing_text">Ended:</h6>
                <h6 class="listing_text">Credits:</h6>
            </div>
        </div>
        <div class="modal fade" id="update_Profile_Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Change your avatar</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form class="update_profile_form" id="update_profile_form">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label url">Avatar url</label>
                                <input type="url" class="form-control" id="avatar_input" />
                            </div>
                            <button type="submit" class="btn btn-primary">Update Avatar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>     
    `;

    addUpdateProfileListener(userName, token);
}

document.addEventListener("DOMContentLoaded", initializeProfileUpdate);
