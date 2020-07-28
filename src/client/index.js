import { generateTripDetails } from './js/app';

import './styles/main.scss'

// once HTML document has fully loaded, callback function allows click on the generate (Let's Go!) button to execute generateTripDetails
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('generate').addEventListener('click', generateTripDetails);
});

export { generateTripDetails }