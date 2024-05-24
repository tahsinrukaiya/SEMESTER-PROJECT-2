import { API_BASE } from "../constants.mjs";
import { API_BID } from "../constants.mjs";
import { loadStorage } from "../storage/local_storage.mjs";
import { getListingIdFromQuery } from "./single_listing.mjs";
import { API_KEY } from "../constants.mjs";

export function sendBid() {
    const bid_form = document.getElementById("bid_form");
    bid_form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const bid_input = document.getElementById("bid_input");
        const bid_history_container = document.getElementById("bid_history_container");

        // Function to get the userName from local storage
        function getUserNameFromLocalStorage() {
            const userProfile = loadStorage("user_profile");
            if (userProfile && userProfile.userName) {
                return userProfile.userName;
            } else {
                console.error("User profile or userName not found in local storage");
                return null;
            }
        }

        const token = loadStorage("token");

        // Retrieve logged-in user's name
        const loggedInUserName = getUserNameFromLocalStorage();

        async function place_bid() {
            const listingId = getListingIdFromQuery();
            console.log("Listing ID:", listingId);
            if (!listingId) {
                console.error("Listing ID not provided in the URL");
                return;
            }
            const bidAmount = bid_input.value;
            const bid = parseFloat(bid_input.value);

            if (!bidAmount) {
                console.error("Bid amount is empty");
                return;
            }

            // Defining optional query parameters
            const queryParams = {
                _seller: true,
                _bids: true,
            };

            // Including the query parameters in the URL
            const url = `${API_BASE}${API_BID}${listingId}/bids`;
            console.log("Request URL:", url);

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "X-Noroff-API-Key": API_KEY,
                    },
                    body: JSON.stringify({ amount: bid }), // Sending the bid amount in the request body
                });

                const updatedListingDetail = await response.json();
                console.log(updatedListingDetail);
                console.log("Listing Detail:", updatedListingDetail);

                // To show Bid history
                if (bid_history_container) {
                    if (updatedListingDetail.data.bids === 0) {
                        bid_history_container.innerHTML =
                            '<div class="text-center">No bids yet</div>';
                    } else {
                        let bidHistoryHTML = ""; // Initialize the string for accumulating HTML

                        // Iterate over each bid in the bids array
                        updatedListingDetail.data.bids.forEach((bid) => {
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
                    // Reload the page after updating the bid history
                    window.location.reload();

                } else {
                    console.error("Bid history container not found");
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        }
        place_bid();
    });
}