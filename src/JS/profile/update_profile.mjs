import { API_BASE, API_UPDATE_PROFILE, API_KEY } from "../constants.mjs";
import { userProfile } from "./user_profile.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const { userName, userAvatar, userEmail, credits, listings, wins } = userProfile;
    console.log("User Avatar URL:", userAvatar.url);

    // Ensure the input field is populated with the current avatar URL when the modal is shown
    const updateProfileModal = document.getElementById('update_profile_modal');
    if (updateProfileModal) {
        updateProfileModal.addEventListener('show.bs.modal', () => {
            const avatarInput = document.getElementById('avatar_input');
            if (avatarInput) {
                avatarInput.value = userAvatar.url;
                console.log(`Set avatar URL to: ${userAvatar.url}`);
            } else {
                console.error("Avatar input field not found");
            }
        });
    } else {
        console.error("Update profile modal not found");
    }

    // Reference to update_profile_form
    const update_profile_form = document.getElementById('update_profile_form');
    if (update_profile_form) {
        console.log("Update profile form found");

        // Retrieve the access token from local storage
        const token = JSON.parse(localStorage.getItem('token'));
        console.log(token);

        update_profile_form.addEventListener("submit", (event) => {
            event.preventDefault();

            const avatarInput = document.getElementById('avatar_input');
            if (!avatarInput) {
                console.error("Avatar input field not found during form submission");
                return;
            }

            // User updated inputs from the form
            const updatedProfile = {
                avatar: avatarInput.value,
            };
            console.log("Updated profile:", updatedProfile);

            // Call the function to update the profile
            updateProfile(userName, updatedProfile, token);
        });
    } else {
        console.error("Update profile form not found");
    }
});


async function updateProfile(userName, updatedProfile, token) {
    // Constructing the api url and log it for debugging
    const apiUrl = `${API_BASE}/auction/profiles/${userName}`;
    console.log("API URL:", apiUrl);

    //API call here with access token
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY
            },
            body: JSON.stringify(updatedProfile),
        });

        console.log("API response status:", response.status);

        // Check if the server response was OK
        if (!response.ok) {
            // More details about the error returned by the server
            const errorText = await response.text();
            console.error("Error from server:", errorText);
            throw new Error("Network Issue");
        }
        else {
            console.log("Profile update successful!");
            // Updating userProfile object
            userProfile.userAvatar.url = updatedProfile.avatar;

            // Save updated avatar URL to local storage
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            console.log("Updated userProfile saved to local storage");


            const main_container = document.getElementById('main_container');
            main_container.innerHTML = `
                <div class="row pb-5">
                    <div class="col">
                        <h3 class="text-center mt-5 heading">Profile</h3>
                        <div class="card mt-5 text-center profile_card" id="profile_card">
                            <img class="card-img-top rounded-pill profile_photo" src="${updatedProfile.avatar}" alt="Updated avatar">
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
                                        <label for="avatar_input" class="form-label">Avatar URL</label>
                                        <input type="url" class="form-control" id="avatar_input" />
                                    </div>
                                    <button type="submit" class="btn btn-primary">Update Avatar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>     
            `;
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}
