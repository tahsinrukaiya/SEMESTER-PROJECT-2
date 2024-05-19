import { API_BASE } from "../constants.mjs";
import { API_AUTH } from "../constants.mjs";
import { API_REGISTER } from "../constants.mjs";



const registerForm = document.getElementById('register_form');
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        //Object creation to capture the current values when the form is submitted
        const createUser = {
            name: user_name.value,
            email: email_address.value,
            password: password.value,
        };
        console.log(createUser);

        //Function to create a user on Noroff API by using POST method.
        async function registerUser(url, data) {
            try {
                //making an api call
                const postData = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                };
                const response = await fetch(url, postData);
                console.log(response);
                console.log("Registration Successfull!", response);
                alert("Registration Successfull!");
                window.location.href = "../logIn/index.html";

                if (!response.ok) {
                    throw new Error("Network Issue");
                }
                const json = await response.json();
                console.log(json);

            }
            catch (error) {
                console.error(error);
            }
        }
        registerUser((API_BASE + API_AUTH + API_REGISTER), createUser);
    })
}


