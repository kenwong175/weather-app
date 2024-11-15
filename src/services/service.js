export async function getGeoLocation(city,country){
    const countryData = country ? country : "";
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${countryData}&limit=1&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
    try {
        if(!city){
            throw new Error("Please input city!");
        }
        const response = await fetch(url);
        const json = await response.json();
        if(Object.keys(json).length>0){
            return json;
        } else {
            throw new Error("Not Found");
        };
    } catch (error) {
        throw error;
    }
}

export async function getWeatherService(city, country){
    try {
        const locationRes = await getGeoLocation(city, country);
        const lat = locationRes[0].lat;
        const lon = locationRes[0].lon;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`;
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
       throw error;
    }
}