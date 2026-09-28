import SearchBar from './searchBar/SearchBar';
import CodeforcesCard from './cards/CodeforcesCard';
import ShortcutsCard from './cards/ShortcutsCard';
import TodoCard from './cards/TodoCard';
import styles from './app.module.css';
import Header from "./header/Header.tsx";

export default function App() {
    return (
        <div className={styles.appContainer}>
            <div className={styles.layoutWrapper}>
                <div className={styles.mainContent}>
                  <Header/>

                    <div className={styles.searchSection}>
                        <SearchBar />
                    </div>

                    <div className={styles.grid}>
                        <ShortcutsCard />
                        <CodeforcesCard id="cf-1" defaultHandle="Abnormality" />

                        <TodoCard id="todo-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}