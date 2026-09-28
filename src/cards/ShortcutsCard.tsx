import { useState, useEffect } from 'react';
import { Settings, X, Plus, Trash2 } from 'lucide-react';
import styles from './shortcutsCard.module.css';
import "./commonCard.css";

interface Shortcut {
    id: string;
    title: string;
    url: string;
}

const DEFAULT_SHORTCUTS: Shortcut[] = [
    { id: '1', title: 'GitHub', url: 'https://github.com' },
    { id: '2', title: 'YouTube', url: 'https://youtube.com' },
    { id: '3', title: 'Codeforces', url: 'https://codeforces.com' },
    { id: '4', title: 'Slack', url: 'https://app.slack.com' },
    { id: '5', title: 'LeetCode', url: 'https://leetcode.com' },
    { id: '6', title: 'CodeChef', url: 'https://www.codechef.com' },
    { id: '7', title: 'Claude', url: 'https://claude.ai' },
    { id: '8', title: 'Stardance', url: 'https://stardance.com' }, // Update .com to the correct TLD if needed
    { id: '9', title: 'Spotify', url: 'https://open.spotify.com' },
];

export default function ShortcutsCard() {
    const [shortcuts, setShortcuts] = useState<Shortcut[]>(() => {
        const saved = localStorage.getItem('dashboard-shortcuts');
        return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');

    useEffect(() => {
        localStorage.setItem('dashboard-shortcuts', JSON.stringify(shortcuts));
    }, [shortcuts]);

    const handleAddShortcut = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newUrl.trim()) return;

        let formattedUrl = newUrl.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`;
        }

        const newShortcut: Shortcut = {
            id: Date.now().toString(),
            title: newTitle.trim(),
            url: formattedUrl,
        };

        setShortcuts([...shortcuts, newShortcut]);
        setNewTitle('');
        setNewUrl('');
    };

    const handleDeleteShortcut = (id: string) => {
        setShortcuts(shortcuts.filter(s => s.id !== id));
    };

    return (
        <>
            <div className={styles.transparentContainer}>
                <button
                    className={styles.settingsBtn}
                    onClick={() => setIsModalOpen(true)}
                    title="Manage Shortcuts"
                >
                    <Settings size={20} />
                </button>

                <div className={styles.iconGrid}>
                    {shortcuts.length === 0 ? (
                        <div className={styles.emptyState}>No shortcuts added.</div>
                    ) : (
                        shortcuts.map((shortcut) => (
                            <a
                                key={shortcut.id}
                                href={shortcut.url}
                                className={styles.gridItem}
                            >
                                <div className={styles.iconCircle}>
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${shortcut.url}&sz=64`}
                                        alt={shortcut.title}
                                        className={styles.favicon}
                                    />
                                </div>
                                <span className={styles.gridTitle}>{shortcut.title}</span>
                            </a>
                        ))
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className={"modalOverlay"}>
                    <div className={"modal"}>
                        <div className={"modalHeader"}>
                            <h3>Manage Shortcuts</h3>
                            <button className={"closeBtn"} onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className={"manageList"}>
                            {shortcuts.map((shortcut) => (
                                <div key={shortcut.id} className={"manageItem"}>
                                    <div className={"manageInfo"}>
                                        <span className={"manageTitle"}>{shortcut.title}</span>
                                        <span className={"manageUrl"}>{shortcut.url}</span>
                                    </div>
                                    <button
                                        className={"deleteBtn"}
                                        onClick={() => handleDeleteShortcut(shortcut.id)}
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className={"divider"}></div>

                        <form onSubmit={handleAddShortcut} className={"addForm"}>
                            <h4 className={"formTitle"}>Add New Shortcut</h4>
                            <div className={"formGroup"}>
                                <input
                                    type="text"
                                    className={"input"}
                                    placeholder="Title (e.g., Gmail)"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={"formGroup"}>
                                <input
                                    type="text"
                                    className={"input"}
                                    placeholder="URL (e.g., mail.google.com)"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={"submitBtn"}>
                                <Plus size={18} /> Add Link
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}