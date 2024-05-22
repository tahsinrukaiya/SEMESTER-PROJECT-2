import { API_BASE } from "../JS/constants.mjs";
import { API_ALL_LISTINGS } from "../JS/constants.mjs";
import { formatDate } from "./date_format.mjs";

const search_form = document.getElementById('search_form');
const search_input = document.getElementById('search_input');
const card_container = document.getElementById('card_container');

search_form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Clear previous search results
    card_container.innerHTML = '';

    async function fetch_listings(url) {
        try {
            const getData = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const response = await fetch(url, getData);
            const listings = await response.json();

            // Create a variable to store the HTML for matched posts
            let matchedPostsHTML = '';

            // Get the search term value from the input field
            const searchTerm = search_input.value.toLowerCase().trim();
            console.log("Search term:", searchTerm);

            for (let i = 0; i < listings.data.length; i++) {
                const listing = listings.data[i];
                const media = listing.media;
                let mediaHTML = '';
                if (media && media.length > 0) {
                    for (let j = 0; j < media.length; j++) {
                        mediaHTML += `<img src="${media[j].url}" class="card-img-top mt-3 px-3 pb-3" alt="...">`;
                    }
                }
                const formattedDate = formatDate(listing.endsAt);

                // Check if the search term is present in the title of the post
                const searchTermFound = listing.title.toLowerCase().includes(searchTerm);
                console.log(`Title: ${listing.title}, Search term found: ${searchTermFound}`);

                // Display the post only if it matches the search term
                if (searchTermFound) {
                    console.log("Search term found in title:", listing.title);
                    matchedPostsHTML += `
                    <div class="col-lg pt-3 pb-4 card_column">
                    <a href="single_listing.html?id=${listing.id}">
                        <div class="card cards">
                           ${mediaHTML}
                            <div class="card-body">
                                <h6 class="card-id">Id: ${listing.id} </h6>
                                <h6 class="card-title">Title: ${listing.title}</h6>
                                <p class="card-text">Bid: ${listing._count.bids} </p>
                                <p class="card-tag">Tags: ${listing.tags}</p>
                                <p class="card-ends_at">Ends at: ${formattedDate} </p>
                            </div>
                      </a>
                    </div>
                </div>`;
                }
            }

            // Update the card container with matched posts HTML
            card_container.innerHTML = matchedPostsHTML || '<p>No matching listings found.</p>';
        }
        catch (error) {
            console.log(error);
        }
    }

    fetch_listings(API_BASE + API_ALL_LISTINGS);
});
