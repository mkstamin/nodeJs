/* eslint-disable*/
import '@babel/polyfill';
import { updateData } from './updateSetting';
import { login, logout } from './_login';
import { displayMap } from './_mapbox';

//DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login')
const userDataForm = document.querySelector('.form-user-data')
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


if(userDataForm){
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        updateData(name, email);
    });  
}