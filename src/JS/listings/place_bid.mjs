import { API_BASE } from "../constants.mjs";
import { API_BID } from "../constants.mjs";

const bid_form = document.getElementById('bid_form');
const bid_input = document.getElementById('bid_input');
const bid_history_container = document.getElementById('bid_history_container');

function getListingIdFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL Parameters:', urlParams.toString()); // Log all query parameters
    return urlParams.get("id");
}

async function place_bid() {
    const listingId = getListingIdFromQuery();
    console.log('Listing ID:', listingId); // Log the listing ID
    if (!listingId) {
        console.error('Listing ID not provided in the URL');
        return;
    }

    // Defining optional query parameters
    const queryParams = {
        _seller: true,
        _bids: true,
    };

    // Converting query parameters to a string
    const queryString = Object.keys(queryParams)
        .map(key => `${key}=${queryParams[key]}`)
        .join('&');

    // Including the query parameters in the URL
    const url = `${API_BASE}${API_BID}${listingId}?${queryString}`;
    console.log('Request URL:', url); // Log the full request URL
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.error('Error:', response.status, response.statusText);
            return;
        }

        const listingDetail = await response.json();
        console.log('Listing Detail:', listingDetail); // Log the API response

        // To show Bid history
        if (bid_history_container) {
            if (listingDetail.data.bids.length === 0) {
                bid_history_container.innerHTML = '<div class="text-center">No bids yet</div>';
            } else {
                let bidHistoryHTML = ''; // Initialize the string for accumulating HTML

                // Iterate over each bid in the bids array
                listingDetail.data.bids.forEach(bid => {
                    const bidderName = bid.bidder.name;
                    const bidAmount = bid.amount;

                    // Append each bid's HTML to the bidHistoryHTML string
                    bidHistoryHTML += `
                        <div class="row row-cols-2 pt-3 bid_history_row">
                            <div class="col pt-2 bid_history_col rounded-start text-start"><h6>${bidderName}</h6></div>
                            <div class="col pt-2 bid_history_col rounded-end text-end"><h6>${bidAmount}</h6></div>
                        </div>`;
                });

                // Set the accumulated HTML to the container
                bid_history_container.innerHTML = bidHistoryHTML;
            }
        } else {
            console.error('Bid history container not found');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

bid_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await place_bid();
});
