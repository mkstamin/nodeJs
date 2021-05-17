/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './_alerts';
const stripe = Stripe('pk_test_51ImDNKFOvHk9kxQndyyL7TQNSOcQulN3yiqqtG8txJUzPnm37ssbssdzIiQyvrnhH2jNRLnJn5sV1KkFWvJUuEgD00HyHjeNax')


export const bookTour = async tourId =>{
    try {     
        const session = await axios(
            `/api/v1/booking/checkout-session/${tourId}`
        )
        
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

    } catch (err) {
        showAlert('error', err)
    }
}