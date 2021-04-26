/* eslint-disable*/
import '@babel/polyfill';
import { login, logout } from './_login';
import { displayMap } from './_mapbox';

//DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form')
const louOutBtn = document.querySelector('.nav__el--logout')

//Delegation'
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations)
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        login(email, password);
    });
}


if(louOutBtn) louOutBtn.addEventListener('click', logout)