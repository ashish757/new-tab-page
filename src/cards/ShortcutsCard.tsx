import { useState, useEffect } from 'react';
import { Settings, X, Plus, Trash2, Bookmark, ExternalLink } from 'lucide-react';
import styles from './shortcutsCard.module.css';

interface Shortcut {
    id: string;
    title: string;
    url: string;
}

const DEFAULT_SHORTCUTS: Shortcut[] = [
    { id: '1', title: 'GitHub', url: 'https://github.com' },
    { id: '2', title: 'YouTube', url: 'https://youtube.com' },
    { id: '3', title: 'Codeforces', url: 'https://codeforces.com' },
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
            <div className={styles.card}>
                <button
                    className={styles.settingsBtn}
                    onClick={() => setIsModalOpen(true)}
                    title="Manage Shortcuts"
                >
                    <Settings size={20} />
                </button>

                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <Bookmark size={20} />
                    </div>
                    <span className={styles.title}>Quick Links</span>
                </div>

                <div className={styles.shortcutsGrid}>
                    {shortcuts.length === 0 ? (
                        <div className={styles.emptyState}>No shortcuts added yet.</div>
                    ) : (
                        shortcuts.map((shortcut) => (
                            <a
                                key={shortcut.id}
                                href={shortcut.url}
                                className={styles.shortcutItem}
                            >
                                <span className={styles.shortcutTitle}>{shortcut.title}</span>
                                <ExternalLink size={14} className={styles.shortcutIcon} />
                            </a>
                        ))
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Manage Shortcuts</h3>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className={styles.manageList}>
                            {shortcuts.map((shortcut) => (
                                <div key={shortcut.id} className={styles.manageItem}>
                                    <div className={styles.manageInfo}>
                                        <span className={styles.manageTitle}>{shortcut.title}</span>
                                        <span className={styles.manageUrl}>{shortcut.url}</span>
                                    </div>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteShortcut(shortcut.id)}
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className={styles.divider}></div>

                        <form onSubmit={handleAddShortcut} className={styles.addForm}>
                            <h4 className={styles.formTitle}>Add New Shortcut</h4>
                            <div className={styles.formGroup}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Title (e.g., Gmail)"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="URL (e.g., mail.google.com)"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                <Plus size={18} /> Add Link
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}