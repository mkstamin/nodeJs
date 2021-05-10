/* eslint-disable*/

import axios from 'axios';
import { showAlert } from './_alerts';

export const updateSettings = async (data, type) => {
    try {
        const url = type === 'password' 
            ? '/api/v1/users/updateMyPassword' 
            : '/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url, 
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} update successfully`);
            location.reload(true)
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
