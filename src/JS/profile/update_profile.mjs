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

