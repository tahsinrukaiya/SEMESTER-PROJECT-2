import { API_BASE, API_UPDATE_PROFILE, API_KEY } from "../constants.mjs";
import { userProfile } from "./user_profile.mjs";

function addUpdateProfileListener() {
    const updateProfileForm = document.getElementById('update_profile_form');

    if (!updateProfileForm) {
        console.error("Update profile form not found");
        return;
    }

    updateProfileForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const avatarUrl = document.getElementById('avatar_input').value;
        console.log("Avatar URL:", avatarUrl);

        if (!avatarUrl) {
            console.error("Avatar URL input is empty");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}${API_UPDATE_PROFILE}${userProfile.userName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "X-Noroff-API-Key": API_KEY,
                },
                body: JSON.stringify({ avatar: avatarUrl }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            console.log("Profile update successful!");
            // update the user profile in local storage
            userProfile.userAvatar.url = avatarUrl;
            localStorage.setItem('user_profile', JSON.stringify(userProfile));

            // Update profile with new avatar
            const profileAvatar = document.getElementById('profile_avatar');
            if (profileAvatar) {
                profileAvatar.src = avatarUrl;
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("User Profile:", userProfile);

    const updateProfileButton = document.getElementById('update_profile');
    if (updateProfileButton) {
        updateProfileButton.addEventListener("click", addUpdateProfileListener);
    }
});
