import { API_BASE } from "../constants.mjs";
import { API_CREATE_LISTING } from "../constants.mjs";
import { API_KEY } from "../constants.mjs";

const main_container = document.getElementById('main_container');
const form_container = document.getElementById('form_container');
const create_listing_form = document.getElementById('create_listing_form');
const listing_title = document.getElementById('listing_title');
const listing_description = document.getElementById('listing_description');
const listing_tags = document.getElementById('listing_tags');
const listing_media = document.getElementById('listing_media');
const listing_end_date = document.getElementById('listing_end_date');
const create_listing_btn = document.getElementById('create_listing_btn');

// Retrieve the access token from local storage
const token = JSON.parse(localStorage.getItem('token'));

// Check if an access token is available
if (token) {
    console.log('Access Token loaded from local storage:', token);

    //for making authenticated API requests.
} else {
    console.log('No Access Token found in local storage');
}

create_listing_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    // User inputs from the form
    const createListing = {
        title: listing_title.value,
        description: listing_description.value,
        tags: listing_tags.value.split(',').map(tag => tag.trim()), // Split tags by comma and trim whitespace
        media: [{
            url: listing_media.value,
            alt: listing_title.value
        }],
        endsAt: new Date(listing_end_date.value).toISOString() // Convert date to ISO string
    };

    console.log(createListing);
    //api call here with accesstoken
    try {
        const response = await fetch(API_BASE + API_CREATE_LISTING, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY
            },
            body: JSON.stringify(createListing),
        });

        if (!response.ok) {
            //more details about the error returned by the server
            const errorText = await response.text();
            console.error("Error from server:", errorText);
            throw new Error("Network Issue");
        }
        else {
            console.log("listing creation successful!");

            // Triggering the Bootstrap modal
            var listing_modal = new bootstrap.Modal(document.getElementById('listing_modal'));
            listing_modal.show();

            // To reload the page after the modal is closed
            listing_modal._element.addEventListener('hidden.bs.modal', function () {
                console.log('Modal closed');
                // Delay the page reload to ensure the modal is closed
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 500);
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});








