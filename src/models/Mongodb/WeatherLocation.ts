import { Schema, model } from 'mongoose';
import { v4 } from 'uuid'; 

interface IWeatherLocation {
    id: string;
    user_id: string;
    latitude: number;
    longitude: number;
}

const schema = new Schema<IWeatherLocation>({
    id: {
        type: String,
        required: true,
        default: v4()
    },
    user_id: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
})
 
const WeatherLocation = model<IWeatherLocation>('WeatherLocations', schema);

export default WeatherLocation;