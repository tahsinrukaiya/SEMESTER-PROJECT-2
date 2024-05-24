import { API_BASE, API_BID, API_KEY, API_SINGLE_LISTING } from "../constants.mjs";
import { loadStorage } from "../storage/local_storage.mjs";
import { getListingIdFromQuery } from "./single_listing.mjs";

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

            const bidUrl = `${API_BASE}${API_BID}${listingId}/bids`;
            const listingUrl = `${API_BASE}${API_SINGLE_LISTING}${listingId}?_seller=true&_bids=true`;

            try {
                // Place the bid
                const bidResponse = await fetch(bidUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "X-Noroff-API-Key": API_KEY,
                    },
                    body: JSON.stringify({ amount: bid }),
                });

                if (!bidResponse.ok) {
                    throw new Error(`Bid placement failed: ${bidResponse.statusText}`);
                }
                // Alert the user that the bid has been placed successfully
                alert("Your bid has been placed successfully!");
                // Fetch the updated listing details including bids
                const listingResponse = await fetch(listingUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "X-Noroff-API-Key": API_KEY,
                    },
                });

                if (!listingResponse.ok) {
                    throw new Error(`Fetching listing details failed: ${listingResponse.statusText}`);
                }

                const updatedListingDetail = await listingResponse.json();
                console.log("Listing Detail:", updatedListingDetail);

                if (bid_history_container) {
                    if (updatedListingDetail.data.bids.length === 0) {
                        bid_history_container.innerHTML = '<div class="text-center">No bids yet</div>';
                    } else {
                        let bidHistoryHTML = "";

                        updatedListingDetail.data.bids.forEach((bid) => {
                            const bidderName = bid.bidder.name;
                            const bidAmount = bid.amount;

                            bidHistoryHTML += `
                              <div class="row row-cols-2 pt-3 bid_history_row">
                                  <div class="col pt-2 bid_history_col rounded-start text-start"><h6>${bidderName}</h6></div>
                                  <div class="col pt-2 bid_history_col rounded-end text-end"><h6>${bidAmount}</h6></div>
                              </div>`;
                        });

                        bid_history_container.innerHTML = bidHistoryHTML;
                    }
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
