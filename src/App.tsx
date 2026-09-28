import DateTimeWeather from './DateTimeWeather.tsx';
import SearchBar from './searchBar/SearchBar';
import CodeforcesCard from './cards/CodeforcesCard';
import ShortcutsCard from './cards/ShortcutsCard';
import TodoCard from './cards/TodoCard';
import styles from './app.module.css';


export default function App() {

    return (
        <div className={styles.appContainer}>
            <div className={styles.layoutWrapper}>

                <div className={styles.mainContent}>
                    <DateTimeWeather />

                    <div className={styles.searchSection}>
                        <SearchBar />
                    </div>

                    <div className={styles.grid}>
                        <TodoCard id="todo-1" />
                        <CodeforcesCard id="cf-1" defaultHandle="Abnormality" />
                        <ShortcutsCard />
                    </div>
                </div>
            </div>

        </div>
    );
}