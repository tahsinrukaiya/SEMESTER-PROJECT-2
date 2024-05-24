import { API_BASE } from "../constants.mjs";
import { API_UPDATE_PROFILE } from "../constants.mjs";
import { userProfile } from "./user_profile.mjs";

const update_profile_btn = document.getElementById('update_profile');
const update_profile_form = document.getElementById('update_profile_form');
const url_input = document.getElementById('avatar_input');
console.log(url_input);

// Check if userAvatar exists in userProfile before accessing its value
const userAvatar = userProfile && userProfile.userAvatar ? userProfile.userAvatar : null;
console.log(userAvatar);

export async function updateProfile(userName, token) {
    update_profile_form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Check if userAvatar exists before attempting to update the profile
        if (userAvatar) {
            // User inputs from the form
            const updateProfile = {
                avatar: userAvatar,
            };

            console.log(updateProfile);

            //api call here with accesstoken
            try {
                const url = `${API_BASE}${API_UPDATE_PROFILE}${userName}`;
                console.log(url);
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        "X-Noroff-API-Key": API_KEY
                    },
                    body: JSON.stringify(updateProfile),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error from server:", errorText);
                    throw new Error("Network Issue");
                } else {
                    console.log("Profile Update successful!");
                    const profile_card = document.getElementById('profile_card');

                    profile_card.innerHTML = `
                        <div class="card mt-5 text-center profile_card">
                        <img class="card-img-top" src="${avatar}" alt="Card image cap"></img>
                        </div>`;
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("User avatar does not exist in userProfile. Cannot update profile.");
        }
    });
}

// Call the function with appropriate parameters
const userName = "exampleUserName"; // Replace with actual user name
const token = "exampleToken"; // Replace with actual token
updateProfile(userName, token);
