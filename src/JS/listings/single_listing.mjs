import { API_BASE } from "../constants.mjs";
import { API_SINGLE_LISTING } from "../constants.mjs";
import { formatDate } from "../date_format.mjs";


function getListingIdFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

//FUNCTION TO FETCH POST DETAIL USING ID AND TITLE-------------------------
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
    const main_container = document.getElementById('main_container');
    const card_container = document.getElementById('card_container');
    const product_detail = document.getElementById('product_detail');
    const formattedDate = formatDate(listingDetail.data.endsAt);
    const count = listingDetail._count;
    const seller = listingDetail.seller;

    card_container.innerHTML = `<div class="card mb-5 product_detail" id="product_detail">
    <img class="card-img-top pt-5 px-5 pb-5" src="${listingDetail.data.media[0].url} " alt="Card image cap">
    <div class="card-body">
    <h5 class="card-id text-center mt-2">ID: ${listingDetail.data.id} </h5>
    <h5 class="card-title text-center mt-2">Title: ${listingDetail.data.title}</h5>
    </div>
    <div class="row mt-5"> 
        <div class="col">
            <h6 class="text text-start border-bottom mx-5 pb-2">Current Bid: </h6>
        </div>
        <div class="col">
            <h6 class="text text-end border-bottom  mx-5 pb-2 bid"> ${count}</h6>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col">
            <h6 class="text text-start border-bottom mx-5 pb-2">Ends At</h6>
        </div>
        <div class="col">
            <h6 class="text text-end border-bottom  mx-5 pb-2">${formattedDate}</h6>
        </div>
    </div>
    
    <div class="row mt-3">
        <div class="col">
            <h6 class="text text-start border-bottom mx-5 pb-2">Seller</h6>
        </div>
        <div class="col">
            <h6 class="text text-end border-bottom  mx-5 pb-2">${seller}</h6>
        </div>
    </div>
    <form class="bid_form mt-5">
        <div class="row">
            <div class="col">
                <input type="text" class="form-control rounded-pill bid_input" placeholder="bid">
            </div>
            <div class="col">
                <button type="submit" class="btn mb-2 rounded-pill btn_submit_bid">Submit a bid</button>
            </div>
        </div>
    </form>
</div>`;
}

fetch_single_listing();


