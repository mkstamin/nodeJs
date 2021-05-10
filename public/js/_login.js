/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './_alerts';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password,
            },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully! Wait for a while.....');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async()=>{
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Loging Out.....! 😊');
            location.assign('/');
        }   

    } catch (err) {
        showAlert('error', 'Error logging out! Try again.');
    }
}
