import { API_BASE } from "../constants.mjs";
import { API_ALL_LISTINGS } from "../constants.mjs";
import { formatDate } from "../date_format.mjs";

const card_container = document.getElementById('card_container');
const card_row = document.getElementById('card_row');
const card_column = document.getElementById('card_column');
const card = document.getElementById('cards');


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

        for (let i = 0; i < listings.data.length; i++) {
            const media = listings.data[i].media;
            let mediaHTML = '';
            if (media && media.length > 0) {
                for (let j = 0; j < media.length; j++) {
                    mediaHTML = `<img src="${media[j].url}" class="card-img-top mt-3 px-3 pb-3" alt="...">`;
                }
            }
            const formattedDate = formatDate(listings.data[i].endsAt);
            card_row.innerHTML += `
                    <div class="col-lg pt-3 pb-4 card_column">
                    <a href="single_product.html">
                        <div class="card cards">
                           ${mediaHTML}
                            <div class="card-body">
                                <h6 class="card-id">Id: ${listings.data[i].id} </h6>
                                <h6 class="card-title">Title: ${listings.data[i].title}</h6>
                                <p class="card-text">Description: ${listings.data[i].description} </p>
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

