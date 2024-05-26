import { API_BASE, API_UPDATE_PROFILE, API_KEY } from "../constants.mjs";

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

        async function updateAvatar() {
            try {
                const response = await fetch(`${API_BASE}${API_UPDATE_PROFILE}${userName}?_listings=true&_wins=true`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        "X-Noroff-API-Key": API_KEY
                    },
                    body: JSON.stringify(updatedProfile),
                });

                if (!response.ok) {
                    // More details about the error returned by the server
                    const errorText = await response.text();
                    console.error("Error from server:", errorText);
                    throw new Error("Network Issue");
                } else {
                    console.log("Update avatar successful!");
                    // const updatedAvatar = await response.json();
                    // Construct the HTML content
                    main_container.innerHTML = `  innerHTML to the container will be handled later  `;
                }

            }
            catch (error) {
                console.log(error);
            }
        }
        updateAvatar();
    });
} else {
    console.error("Update profile form not found");
}

