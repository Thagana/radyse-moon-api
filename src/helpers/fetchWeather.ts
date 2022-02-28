import axios from 'axios';
import { configs } from '../configs/app.configs';

export const fetchWeather = async (latitude: number, longitude: number) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${configs.WEATHER_API_KEY}&units=metric`);
    if (response.status === 200) {
        const icon = response.data.weather[0].icon
        const temp = response.data.main.temp
        const location = response.data.name;
        const minTemp = response.data.main.temp_min;
        const maxTemp = response.data.main.temp_max;
        const description = response.data.weather[0].description
        return {
            icon,
            temp,
            location, 
            minTemp,
            maxTemp, 
            description
        }
    }
    return false
}
export default fetchWeather