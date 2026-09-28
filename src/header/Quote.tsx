import { useState, useEffect } from 'react';
import styles from './header.module.css';

const QUOTES = [
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
    { text: "It's not a bug. It's an undocumented feature.", author: "Anonymous" }
];

export default function Quote() {
    const [quote, setQuote] = useState(QUOTES[0]);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * QUOTES.length);
        setQuote(QUOTES[randomIndex]);
    }, []);

    return (
        <div className={styles.quoteContainer}>
        <p className={styles.quoteText}>"{quote.text}"</p>
            <span className={styles.quoteAuthor}>— {quote.author}</span>
    </div>
);
}