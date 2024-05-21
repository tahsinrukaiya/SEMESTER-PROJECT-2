import { removeStorage } from "./storage/local_storage.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const log_out_icon = document.getElementById('log_out_icon');

    if (log_out_icon) {
        log_out_icon.addEventListener('click', () => {

            const tokenKey = 'token';
            const userProfileKey = 'user_profile';

            // Remove token and user profile from localStorage
            removeStorage(tokenKey);
            removeStorage(userProfileKey);

            alert("You are now logged out!");

            // Optionally, redirect the user to the login page or home page
            window.location.href = 'index.html';
        });
    } else {
        console.error("Logout icon not found!");
    }
});
