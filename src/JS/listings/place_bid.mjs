import { API_BASE } from "../constants.mjs";
import { API_BID } from "../constants.mjs";
import { loadStorage } from '../storage/local_storage.mjs';
import { getListingIdFromQuery } from './single_listing.mjs';

const bid_form = document.getElementById('bid_form');

bid_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    document.addEventListener('DOMContentLoaded', () => {
        const bid_input = document.getElementById('bid_input');
        const bid_history_container = document.getElementById('bid_history_container');

        // Function to get the userName from local storage
        function getUserNameFromLocalStorage() {
            const userProfile = loadStorage('user_profile');
            if (userProfile && userProfile.userName) {
                return userProfile.userName;
            } else {
                console.error('User profile or userName not found in local storage');
                return null;
            }
        }

        // Retrieve logged-in user's name
        const loggedInUserName = getUserNameFromLocalStorage();

        async function place_bid() {
            const listingId = getListingIdFromQuery();
            console.log('Listing ID:', listingId);
            if (!listingId) {
                console.error('Listing ID not provided in the URL');
                return;
            }

            const listingSellerName = listingDetail.data.seller.name;
            if (listingSellerName === loggedInUserName) {
                console.error('You cannot place a bid on your own listing');
                return;
            }

            const bidAmount = bid_input.value;
            if (!bidAmount) {
                console.error('Bid amount is empty');
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
            console.log('Request URL:', url);

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: bidAmount }) // Sending the bid amount in the request body
                });

                if (!response.ok) {
                    console.error('Error:', response.status, response.statusText);
                    return;
                }

                const updatedListingDetail = await response.json();
                console.log('Listing Detail:', updatedListingDetail);

                // To show Bid history
                if (bid_history_container) {
                    if (updatedListingDetail.data.bids.length === 0) {
                        bid_history_container.innerHTML = '<div class="text-center">No bids yet</div>';
                    } else {
                        let bidHistoryHTML = ''; // Initialize the string for accumulating HTML

                        // Iterate over each bid in the bids array
                        updatedListingDetail.data.bids.forEach(bid => {
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
        place_bid();
    });

});



