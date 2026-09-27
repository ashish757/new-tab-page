import styles from "./searchBar.module.css"
import { Search } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

const SearchBar = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [engine, setEngine] = useState("google");

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                document.activeElement &&
                (document.activeElement.tagName === 'INPUT' ||
                    document.activeElement.tagName === 'TEXTAREA')
            ) {
                return;
            }

            if (event.key === '/') {
                event.preventDefault();
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let searchUrl;
        switch (engine) {
            case "duckduckgo":
                searchUrl = `https://duckduckgo.com/?q=${query}`;
                break;
            case "bing":
                searchUrl = `https://www.bing.com/search?q=${query}`;
                break;
            case "google":
            default:
                searchUrl = `https://www.google.com/search?q=${query}`;
                break;
        }

        window.location.href = searchUrl;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.searchBar}>
                <Search />
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="What are you looking for? (press / to focus)"
                        name="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>
                <div className={styles.dropdown}>
                    <select value={engine} onChange={(e) => setEngine(e.target.value)}>
                        <option value="google">Google</option>
                        <option value="duckduckgo">Duck Duck Go</option>
                        <option value="bing">Bing</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default SearchBar;