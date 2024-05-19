/*import { API_BASE } from "./constants.mjs";
import { API_AUTH } from "./constants.mjs";
import { API_KEY } from "./constants.mjs";

export async function get_api_key() {
    const token = JSON.parse(localStorage.getItem('token')); // Parse the token
    console.log("Retrieved token:", token);

    if (!token) {
        console.error("Token not found in localStorage");
        throw new Error("Token not found");
    }
    const response = await fetch(API_BASE + API_AUTH + API_KEY, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: "my api key"
        })
    });

    if (response.ok) {
        return await response.json();
    }
    console.error(await response.json());
    throw new Error("Could not register an API key!");
}

get_api_key().then(console.log);
*/