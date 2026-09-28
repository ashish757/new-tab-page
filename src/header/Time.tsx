import { useState, useEffect } from 'react';
import styles from './header.module.css';

export default function Time() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);


    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });


    return (
            <div className={styles.dateTime}>
                <div className={styles.time}>{formattedTime}</div>
                <div className={styles.date}>{formattedDate}</div>
            </div>
    );
}