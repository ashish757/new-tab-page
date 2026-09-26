import { X, Image as ImageIcon, Layout, Palette } from 'lucide-react';
import styles from './settingsSidebar.module.css';

export interface DashboardSettings {
    bgType: 'color' | 'gradient' | 'image';
    bgValue: string;
    theme: 'dark' | 'light';
    cards: {
        codeforces: boolean;
        github: boolean;
        shortcuts: boolean;
        todo: boolean;
    };
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    settings: DashboardSettings;
    onUpdate: (newSettings: DashboardSettings) => void;
}

export default function SettingsSidebar({ isOpen, onClose, settings, onUpdate }: Props) {
    const handleCardToggle = (card: keyof DashboardSettings['cards']) => {
        onUpdate({
            ...settings,
            cards: {
                ...settings.cards,
                [card]: !settings.cards[card]
            }
        });
    };

    const handleBgChange = (type: DashboardSettings['bgType'], value: string) => {
        onUpdate({ ...settings, bgType: type, bgValue: value });
    };

    return (
        <>
            {isOpen && <div className={styles.overlay} onClick={onClose} />}

            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2>Customization</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Card Visibility Section */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <Layout size={18} /> Visible Cards
                        </h3>
                        <div className={styles.toggleList}>
                            {Object.entries(settings.cards).map(([key, isVisible]) => (
                                <label key={key} className={styles.toggleItem}>
                                    <span className={styles.toggleLabel}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </span>
                                    <div className={`${styles.switch} ${isVisible ? styles.switchOn : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={isVisible}
                                            onChange={() => handleCardToggle(key as keyof DashboardSettings['cards'])}
                                            className={styles.hiddenInput}
                                        />
                                        <div className={styles.slider}></div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <ImageIcon size={18} /> Background
                        </h3>

                        <div className={styles.bgOptions}>
                            <button
                                className={`${styles.bgBtn} ${settings.bgType === 'color' ? styles.activeBgBtn : ''}`}
                                onClick={() => handleBgChange('color', '#0f172a')}
                            >
                                Color
                            </button>
                            <button
                                className={`${styles.bgBtn} ${settings.bgType === 'gradient' ? styles.activeBgBtn : ''}`}
                                onClick={() => handleBgChange('gradient', 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)')}
                            >
                                Gradient
                            </button>
                            <button
                                className={`${styles.bgBtn} ${settings.bgType === 'image' ? styles.activeBgBtn : ''}`}
                                onClick={() => handleBgChange('image', 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2342&auto=format&fit=crop')}
                            >
                                Image
                            </button>
                        </div>

                        <div className={styles.bgInputContainer}>
                            <label>Value (Hex, CSS, or URL)</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={settings.bgValue}
                                onChange={(e) => handleBgChange(settings.bgType, e.target.value)}
                                placeholder={settings.bgType === 'image' ? "Paste image URL..." : "Enter color/gradient..."}
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <Palette size={18} /> Theme
                        </h3>
                        <div className={styles.bgOptions}>
                            <button
                                className={`${styles.bgBtn} ${settings.theme === 'dark' ? styles.activeBgBtn : ''}`}
                                onClick={() => onUpdate({ ...settings, theme: 'dark' })}
                            >
                                Dark
                            </button>
                            <button
                                className={`${styles.bgBtn} ${settings.theme === 'light' ? styles.activeBgBtn : ''}`}
                                onClick={() => onUpdate({ ...settings, theme: 'light' })}
                            >
                                Light
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}