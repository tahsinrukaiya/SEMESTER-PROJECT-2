import { API_BASE } from "../constants.mjs";
import { API_SINGLE_LISTING } from "../constants.mjs";
import { formatDate } from "../date_format.mjs";
import { loadStorage } from '../storage/local_storage.mjs';

export function getListingIdFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

// Function to check if the user is logged in
function isUserLoggedIn() {
    const token = loadStorage('token');
    return !!token;
}

// FUNCTION TO FETCH POST DETAIL USING ID AND TITLE
export async function fetch_single_listing() {

    const listingId = getListingIdFromQuery();
    console.log(listingId);

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
    const url = `${API_BASE}${API_SINGLE_LISTING}${listingId}?${queryString}`;
    console.log(url);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    console.log(response);
    if (!response.ok) {
        console.error('Error:', response.status, response.statusText);
        return;
    }

    const listingDetail = await response.json();
    console.log(listingDetail);
    const main_container = document.getElementById('main_container');
    const card_container = document.getElementById('card_container');
    const product_detail = document.getElementById('product_detail');
    const bid_history_container = document.getElementById('bid_history_container');
    const formattedDate = formatDate(listingDetail.data.endsAt);
    const formattedDate2 = formatDate(listingDetail.data.created);
    const count = listingDetail.data._count;
    const seller = listingDetail.data.seller;
    const bids = listingDetail.data.bids; // This is an array of bids

    //retrieve bidder name and bid amount
    let bidder_name = 'N/A';
    let bid_amount = 0;

    if (listingDetail.data.bids.length > 0) {
        const firstBid = listingDetail.data.bids[0];
        if (firstBid.bidder && firstBid.bidder.name) {
            bidder_name = firstBid.bidder.name;
        }
        if (firstBid.amount) {
            bid_amount = firstBid.amount;
        }
    }

    // Generate HTML for media
    const mediaHTML = listingDetail.data.media.map(mediaItem =>
        `<img class="card-img-top pt-5 px-5 pb-5" src="${mediaItem.url}" alt="Card image cap">`
    ).join('');


    card_container.innerHTML = `<div class="card mb-5 product_detail" id="product_detail">
    ${mediaHTML}
        <div class="card-body">
        <h5 class="card-id text-center mt-2">ID: ${listingDetail.data.id}</h5>
        <h5 class="card-title text-center mt-2">Title: ${listingDetail.data.title}</h5>
        </div>
        <div class="row mt-5 border-bottom mx-5">
            <div class="col">
                <h6 class="text text-start mx-5 pb-1">Number of Bids:</h6>
            </div>
            <div class="col">
                <h6 class="text text-end mx-5 pb-1 bid">${count.bids}</h6>
            </div>
        </div>
        <div class="row mt-3 border-bottom mx-5">
            <div class="col">
                <h6 class="text text-start mx-5 pb-1">Ends At</h6>
            </div>
            <div class="col">
                <h6 class="text text-end mx-5 pb-1">${formattedDate}</h6>
            </div>
        </div>
        <div class="row mt-3 border-bottom mx-5">
            <div class="col">
                <h6 class="text text-start mx-5 pb-1">Created</h6>
            </div>
            <div class="col">
                <h6 class="text text-end mx-5 pb-1">${formattedDate2}</h6>
            </div>
        </div>
        <div class="row mt-3 border-bottom mx-5">
            <div class="col">
                <h6 class="text text-start mx-5 pb-1">Seller</h6>
            </div>
            <div class="col">
                <h6 class="text text-end mx-5 pb-2">${seller.name}</h6>
            </div>
        </div>
       <a href="../logIn/index.html" id="loginPrompt" class="link_login"><h6 class = "text text-center mt-5 mb-5 text_link">To place a bid and view bid history, please log in</h6></a>
    </div>`;

    // Only show the bid form if the user is logged in
    if (isUserLoggedIn()) {
        loginPrompt.style.display = 'none';
        card_container.innerHTML += `
        <form class="bid_form mt-5" id="bid_form">
            <div class="row">
                <div class="col">
                    <input type="text" class="form-control rounded-pill bid_input" id="bid_input" placeholder="enter your bid">
                </div>
                <div class="col">
                    <button type="submit" class="btn mb-2 rounded-pill btn_submit_bid" id="btn_submit_bid">Submit a bid</button>
                </div>
            </div>
        </form>`;

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
    }

}
fetch_single_listing();
