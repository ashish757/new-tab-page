import styles from './header.module.css'

import Quote from "./Quote.tsx";
import Time from "./Time";
import Weather from "./Weather.tsx";

export default function Header()  {
    return (
        <div className={styles.header}>
            <Quote/>
            <Time />
            <Weather/>
        </div>
    )
}