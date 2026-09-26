import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Loader2 } from 'lucide-react';
import styles from './dateTimeWeather.module.css';

export default function DateTimeWeather() {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
    const [loading, setLoading] = useState(true);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch weather data
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Coordinates set to Gurugram, Haryana
                const lat = 28.4595;
                const lon = 77.0266;
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                const data = await res.json();

                setWeather({
                    temp: Math.round(data.current_weather.temperature),
                    code: data.current_weather.weathercode
                });
            } catch (error) {
                console.error("Failed to fetch weather", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    // WMO Weather interpretation codes
    const getWeatherIcon = (code: number) => {
        if (code === 0 || code === 1) return <Sun size={28} className={styles.iconSun} />;
        if (code >= 50 && code <= 69) return <CloudRain size={28} className={styles.iconRain} />;
        return <Cloud size={28} className={styles.iconCloud} />;
    };

    return (
        <div className={styles.container}>
            <div className={styles.dateTime}>
                <div className={styles.time}>{formattedTime}</div>
                <div className={styles.date}>{formattedDate}</div>
            </div>

            <div className={styles.weather}>
                {loading ? (
                    <Loader2 size={24} className={styles.spinner} />
                ) : weather ? (
                    <>
                        {getWeatherIcon(weather.code)}
                        <span className={styles.temp}>{weather.temp}°C</span>
                    </>
                ) : (
                    <span className={styles.temp}>--°C</span>
                )}
            </div>
        </div>
    );
}