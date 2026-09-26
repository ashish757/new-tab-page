import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import DateTimeWeather from './DateTimeWeather.tsx';
import SearchBar from './searchBar/SearchBar';
import CodeforcesCard from './cards/CodeforcesCard';
import GithubCard from './cards/GithubCard';
import ShortcutsCard from './cards/ShortcutsCard';
import TodoCard from './cards/TodoCard';
import SettingsSidebar, { type DashboardSettings } from './cards/SettingsSidebar';
import styles from './app.module.css';

const DEFAULT_SETTINGS: DashboardSettings = {
    bgType: 'color',
    bgValue: '#0f172a',
    theme: 'dark',
    cards: {
        codeforces: true,
        github: true,
        shortcuts: true,
        todo: true
    }
};

export default function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [settings, setSettings] = useState<DashboardSettings>(() => {
        const saved = localStorage.getItem('dashboard-settings');
        return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    });

    useEffect(() => {
        localStorage.setItem('dashboard-settings', JSON.stringify(settings));
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings]);

    const backgroundStyle = settings.bgType === 'image'
        ? { backgroundImage: `url(${settings.bgValue})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
        : { background: settings.bgValue };

    return (
        <div className={styles.appContainer} style={backgroundStyle}>
            <div className={styles.layoutWrapper}>

                {settings.cards.todo && (
                    <div className={styles.sidebarWrapper}>
                        <TodoCard id="todo-1" />
                    </div>
                )}

                <div className={styles.mainContent}>
                    <DateTimeWeather />

                    <div className={styles.searchSection}>
                        <SearchBar />
                    </div>

                    <div className={styles.grid}>
                        {settings.cards.codeforces && <CodeforcesCard id="cf-1" defaultHandle="Abnormality" />}
                        {settings.cards.github && <GithubCard id="gh-1" defaultHandle="ashish757" />}
                        {settings.cards.shortcuts && <ShortcutsCard />}
                    </div>
                </div>
            </div>

            <button
                className={styles.editButton}
                onClick={() => setIsSidebarOpen(true)}
            >
                <Pencil size={24} />
            </button>

            <SettingsSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                settings={settings}
                onUpdate={setSettings}
            />
        </div>
    );
}