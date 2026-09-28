import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Loader2 } from 'lucide-react';
import styles from './header.module.css';

export default function Weather() {
    const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [geoError, setGeoError] = useState(false);

    useEffect(() => {
        const fetchWeather = async (lat: number, lon: number) => {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                const data = await res.json();

                setWeather({
                    temp: Math.round(data.current_weather.temperature),
                    code: data.current_weather.weathercode
                });
            } catch (error) {
                console.error("Failed to fetch weather", error);
                setGeoError(true);
            } finally {
                setLoading(false);
            }
        };

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.warn("Geolocation denied or failed:", error);
                    setGeoError(true);
                    setLoading(false);
                }
            );
        } else {
            setGeoError(true);
            setLoading(false);
        }
    }, []);


    const getWeatherIcon = (code: number) => {
        if (code === 0 || code === 1) return <Sun size={120} className={styles.iconSun} />;
        if (code >= 50 && code <= 69) return <CloudRain size={120} className={styles.iconRain} />;
        return <Cloud size={120} className={styles.iconCloud} />;
    };

    return (
            <div className={styles.weather}>
                {loading ? (
                    <Loader2 size={64} className={styles.spinner} />
                ) : geoError ? (
                    <span className={styles.temp} title="Location access denied">--°</span>
                ) : weather ? (
                    <>
                        {getWeatherIcon(weather.code)}
                        <span className={styles.temp}>{weather.temp}°</span>
                    </>
                ) : (
                    <span className={styles.temp}>--°</span>
                )}
            </div>
    );
}