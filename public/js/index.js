/* eslint-disable*/
import '@babel/polyfill';
import { signup } from './signup';
import { bookTour } from './stripe';
import { updateSettings } from './updateSetting';
import { login, logout } from './_login';
import { displayMap } from './_mapbox';

//DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login')
const singupForm = document.getElementById('signup-form')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
const louOutBtn = document.querySelector('.nav__el--logout')
const btnSavePassword = document.querySelector('.btn-save-password')
const bookBtn = document.getElementById('book-btn')

//Delegation'
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations)
}


if (singupForm) {
    singupForm.addEventListener('submit', async (e)=>{
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        // const data = {
        //     name, email, password, passwordConfirm
        // }
        // signup(data)
        await signup(name, email, password, passwordConfirm)

    })
    
}

// @TODO: challenge to make it more useable

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
        
        const form = new FormData(); // it is used instance of  enctype="multipart/form-data"
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);

        updateSettings(form, 'data');
    });  
}

if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        btnSavePassword.textContent = 'Updating....';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        
        await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');

        btnSavePassword.textContent = 'Save password';

        document.getElementById('password-current').value='';
        document.getElementById('password').value='';
        document.getElementById('password-confirm').value='';

    });  
}

if (bookBtn) {
    bookBtn.addEventListener('click', e=>{
        e.target.textContent = 'Processing....'
        const { tourId }= e.target.dataset;
        bookTour(tourId)
    })
}