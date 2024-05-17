import { API_BASE } from "../JS/constants.mjs";
import { API_ALL_LISTINGS } from "../JS/constants.mjs";
import { formatDate } from "../JS/date_format.mjs";

const card_container = document.getElementById('card_container');
const card_row = document.getElementById('card_row');



async function fetch_all_listings(url) {
    try {
        const getData = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(url, getData);
        const listings = await response.json();
        console.log(listings);

        // Get the first 3 items using slice
        const firstThreeListings = listings.data.slice(0, 3);

        for (let i = 0; i < firstThreeListings.length; i++) {
            const media = firstThreeListings[i].media;
            let mediaHTML = '';
            if (media && media.length > 0) {
                for (let j = 0; j < media.length; j++) {
                    mediaHTML = `<img src="${media[j].url}" class="card-img-top mt-3 px-3 pb-3" alt="...">`;
                }
            }
            const formattedDate = formatDate(listings.data[i].endsAt);

            card_row.innerHTML += `
                    <div class="col-lg pt-3 pb-4 card_column">
                    <a href="public/pages/listing/single_listing.html?id=${listings.data[i].id}">
                        <div class="card cards">
                           ${mediaHTML}
                            <div class="card-body">
                                <h6 class="card-id">Id: ${listings.data[i].id} </h6>
                                <h6 class="card-title">Title: ${listings.data[i].title}</h6>
                                <p class="card-text">Bid: ${listings.data[i]._count.bids} </p>
                                <p class="card-tag">Tags: ${listings.data[i].tags}</p>
                                <p class="card-text"><small class="text-muted">Seller: ${listings.data[i].seller}</small></p>
                                <p class="card-ends_at">Ends at: ${formattedDate} </p>
                            </div>
                      </a>
                    </div>
                </div>`;
        }
    }
    catch (error) {
        console.log(error);
    }
}

fetch_all_listings(API_BASE + API_ALL_LISTINGS);

