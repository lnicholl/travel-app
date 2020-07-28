// global API varaibles
const username = "lnicholl";
const geonamesBaseURL = "http://api.geonames.org/postalCodeSearchJSON?";

const weatherAPI = "8c9148d6a4b1488ba38a37de98440164";
const weatherBaseURL = "https://api.weatherbit.io/v2.0/forecast/daily?";

const pixaAPI = "16964052-894cd943696ee2e893dcff227";
const pixaBaseURL = "https://pixabay.com/api/?";

// function to get number of days away
const getDate = dateOut => {
    // get current date and travel date in milliseconds since January 1 1970
    const date = new Date().getTime();
    const dateOfTravel = new Date(dateOut);
    const travelDateMilliseconds = dateOfTravel.getTime();

    // get difference between date of travel and current date as a positive number
    const difference = Math.abs(travelDateMilliseconds - date);

    // convert milliseconds to a day and round difference/day to nearest number
    const day = 1000 * 60 * 60 * 24;
    const numDaysAway = Math.round(difference / day);
    return numDaysAway;
};

// function to get length of trip
const getLengthOfTrip = (dateOut, dateReturn) => {
    // get date out and date return in milliseconds since January 1 1970
    const dateOutMilliseconds = new Date(dateOut).getTime();
    const dateReturnMilliseconds = new Date(dateReturn).getTime();

    // get difference between date out and date return as a positive number
    const difference = Math.abs(dateOutMilliseconds - dateReturnMilliseconds);

    // convert milliseconds to a day and round difference/day to nearest number
    const day = 1000 * 60 * 60 * 24;
    const lengthOfTrip = Math.round(difference / day);
    return lengthOfTrip;
};

// geonames get request - async function will always return a promise
const getGeonames = async (geonamesBaseURL, city, username) => {
    // await - script is paused until we recieve data from fetch call promise
    // fetch - uses URL + city entered by user + username to query API database
    const response = await fetch(geonamesBaseURL + "placename=" + city + "&username=" + username);
    // try - allows us to test the following code for errors while being executed
    try {
        // once data is recieved from call we save in JSON format - JSON stores and transports data, often between server and webpage
        const data = await response.json();
        return data;
        // handle any errors and logs to console
    } catch (error) {
        console.log("error", error);
    }
};

// weather get request
const getWeather = async (city, weatherBaseURL, weatherAPI) => {
    const response = await fetch(weatherBaseURL + "city=" + city + "&key=" + weatherAPI);
    try {
        const data = await response.json();
        // saves weather description / temperature from returned API call array onto weatherData object
        const weatherData = {};
        weatherData.description = data.data[0].weather.description;
        weatherData.temp = data.data[0].temp;
        console.log(weatherData);
        return weatherData;
    } catch (error) {
        console.log("error", error);
    }
};

// images get request
const getPixaImage = async (city, pixaBaseURL, pixaAPI) => {
    const response = await fetch(pixaBaseURL + "key=" + pixaAPI + "&q=" + city + "&image_type=photo");
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("error", error);
    }
};

// main function using Promise API
const generateTripDetails = () => {
    // select DOM elements to take in dynamic values entered by user
    // return appropriate alerts if inputs are left empty by user
    const city = document.getElementById("city").value;
    if (!city) {
        return alert("Please enter a city");
    }
    const dateOut = document.getElementById("dateOut").value;
    const dateReturn = document.getElementById("dateReturn").value;
    if (!dateOut || !dateReturn) {
        return alert("Please check your outbound/return dates");
    }

    // variables to use in geoNamesResponse string
    const daysCountdown = getDate(dateOut);
    const lengthOfTrip = getLengthOfTrip(dateOut, dateReturn);

    // call to geoNames API (pending) - once completed (fulfilled), .then geonamesResponse makes post request and chains promises to happen next
    getGeonames(geonamesBaseURL, city, username).then((geonamesResponse) => {
        try {
            // saves placeName of first location in postal code array to variable
            const geonamesData = geonamesResponse.postalCodes[0].placeName;
            console.log(geonamesData);
            // generates string for user in countdown DOM element
            document.getElementById("countdown").innerHTML = "You are travelling to " + geonamesData + " in " + daysCountdown + " days. The length of your trip is " + lengthOfTrip + " days.";

            // call to weather API - once completed, .then executes weatherResponse next
            getWeather(city, weatherBaseURL, weatherAPI).then((weatherResponse) => {
                try {
                    // uses geoNames data from above
                    document.getElementById("weather").innerHTML = "You should expect the weather in " + geonamesData + " to be: ";
                    // generates string for user from description and temp on weatherResponse, 'take a look below' refers to pixabay image
                    const description = weatherResponse.description + ". The temperature is " + weatherResponse.temp + "°C. Take a look below!";
                    document.getElementById("description").innerHTML = description;

                    // once appropriate data from above recieved, it is saved onto allData object which is used in the post request
                    const allData = {
                        dateOut: dateOut,
                        dateReturn: dateReturn,
                        city: geonamesData,
                        description: description,
                    };
                    postData("http://localhost:8000/addData", allData);
                } catch (error) {
                    console.log("error", error);
                }
            });
            // call to pixabay API includes city entered by user - once completed, .then executes promise to place first image from hits array into DOM element
            getPixaImage(city, pixaBaseURL, pixaAPI).then((pixaResponse) => {
                document.getElementById("pixaImage").src = pixaResponse.hits[0].webformatURL;
            });
        } catch (error) {
            console.log("error", error);
        }
    });
};

// POST promise request used in generateTripDetails, with ("http://localhost:8000/addData", allData) as parameters
const postData = async (url = "", data = {}) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        // changes body into string as servers deal with data as strings
        body: JSON.stringify(data),
    });

    try {
        // returns allData object from generateTripDetails to server
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log("error", error);
    }
};

// generateTripDetails is imported into index.js where it is called using a click event listener
export { generateTripDetails };