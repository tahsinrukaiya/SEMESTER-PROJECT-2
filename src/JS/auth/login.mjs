import { API_BASE } from "../constants.mjs";
import { API_LOGIN } from "../constants.mjs";
import { API_AUTH } from "../constants.mjs";
import { saveStorage } from "../storage/local_storage.mjs";


const logInForm = document.getElementById("logIn_form");
const email = document.getElementById("email_address");
const password = document.getElementById("password");


if (logInForm) {
    logInForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const userLogin = {
            email: email.value,
            password: password.value,
        };

        async function loginUser(url, data) {
            try {
                const postData = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                };
                const response = await fetch(url, postData);

                if (!response.ok) {
                    throw new Error("Network Issue");
                }
                else {
                    const json = await response.json();
                    console.log(json);
                    saveStorage("token", json.data.accessToken);
                    saveStorage("user_profile", {
                        userName: json.data.name,
                        userEmail: json.data.email,
                        userAvatar: json.data.avatar,
                    });
                    console.log(response);
                    console.log("Log in Successfull!", response);
                    alert("Log in success!");
                    window.location.href = "../../../index.html";
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        loginUser(API_BASE + API_AUTH + API_LOGIN, userLogin);
    })
}

