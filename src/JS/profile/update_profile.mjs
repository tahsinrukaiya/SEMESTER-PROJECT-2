import { API_BASE, API_UPDATE_PROFILE, API_KEY } from "../constants.mjs";

// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const profile = JSON.parse(localStorage.getItem("user_profile"));

    const main_container = document.getElementById('main_container');
    if (!main_container) {
        console.error("Main container not found");
        return;
    }

    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
        console.error("Token not found");
        return;
    }

    function createModal() {
        const modalHTML = `
            <div class="modal fade" id="update_profile_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Change your avatar</h5>
                            <button type="button" class="btn-close rounded-pill" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form class="update_profile_form" id="update_profile_form">
                                <div class="mb-3">
                                    <label for="avatar_input" class="form-label url">Avatar url</label>
                                    <input type="url" class="form-control rounded-pill avatar_input" id="avatar_input" />
                                </div>
                                <button type="submit" class="btn rounded-pill border update_avatar_btn">Update Avatar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>`;
        main_container.insertAdjacentHTML('beforeend', modalHTML);
    }

    createModal();

    const update_profile_form = document.getElementById("update_profile_form");
    if (!update_profile_form) {
        console.error("Update profile form not found");
        return;
    }

    const avatarInput = document.getElementById("avatar_input");
    if (!avatarInput) {
        console.error("Avatar input field not found during form submission");
    }

    update_profile_form.addEventListener("submit", (event) => {
        event.preventDefault();

        const updatedProfile = {
            avatar: {
                url: avatarInput.value,
            },
        };
        console.log("Updated profile:", updatedProfile);

        async function updateAvatar() {
            try {
                const response = await fetch(
                    `${API_BASE}${API_UPDATE_PROFILE}${profile.userName}?_listings=true&_wins=true`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            "X-Noroff-API-Key": API_KEY,
                        },
                        body: JSON.stringify(updatedProfile),
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error from server:", errorText);
                    throw new Error("Network Issue");
                } else {
                    console.log("Update avatar successful!");
                    const updatedAvatar = await response.json();

                    // Update the profile display with the new avatar
                    main_container.innerHTML = `
                        <div class="row pb-5">
                            <div class="col">
                                <h3 class="text-center mt-5 heading">Profile</h3>
                                <div class="card mt-5 text-center profile_card">
                                    <img class="card-img-top rounded-pill profile_photo" src="${updatedAvatar.url}" alt="${updatedAvatar.alt}">
                                    <button type="button" class="btn btn-primary rounded-pill update_profile" id="update_profile" data-bs-toggle="modal" data-bs-target="#update_profile_modal">
                                        Update Profile
                                    </button>
                                    <div class="card-body">
                                        <h2>${profile.name}</h2>
                                        <p>Email: ${profile.email}</p>
                                        <p>Credits: ${profile.credits}</p>
                                        <p>Listings: ${profile._count.listings}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col listing_col" id="listing_col">
                                <h3 class="text-center mt-5"> Your Listing</h3>
                                <h6 class="listing_text">Ongoing:</h6>
                                <h6 class="listing_text"> Won:  ${profile._count.wins}</h6>
                                <h6 class="listing_text"> Ended:</h6>
                                <h6 class="listing_text">Credits: </h6>
                            </div>
                        </div>`;
                    createModal();
                }
            } catch (error) {
                console.log(error);
            }
        }
        updateAvatar();
    });
});
