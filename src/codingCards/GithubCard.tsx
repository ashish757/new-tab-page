import { useState, useEffect } from 'react';
import { Settings, X, GitFork } from 'lucide-react';
import styles from './card.module.css';

interface Props {
    id: string;
    defaultHandle: string;
}

export default function GithubCard({ id, defaultHandle }: Props) {
    const [handle, setHandle] = useState(() => localStorage.getItem(`${id}-handle`) || defaultHandle);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempHandle, setTempHandle] = useState(handle);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        followers: '-',
        repos: '-',
        following: '-',
        lastActive: '-'
    });

    const fetchStats = async (currentHandle: string) => {
        if (!currentHandle) return;
        setLoading(true);

        let newStats = { followers: '-', repos: '-', following: '-', lastActive: '-' };

        try {
            const profileReq = await fetch(`https://api.github.com/users/${currentHandle}`);
            const profile = await profileReq.json();

            const eventsReq = await fetch(`https://api.github.com/users/${currentHandle}/events/public?per_page=1`);
            const events = await eventsReq.json();

            if (profileReq.ok) {
                newStats.followers = profile.followers?.toString() || '0';
                newStats.repos = profile.public_repos?.toString() || '0';
                newStats.following = profile.following?.toString() || '0';

                if (events && events.length > 0) {
                    newStats.lastActive = new Date(events[0].created_at).toLocaleDateString();
                }
            }
        } catch (e) {
            console.error("Failed to fetch GitHub stats", e);
        }

        setStats(newStats);
        setLoading(false);
    };

    useEffect(() => {
        fetchStats(handle);
    }, [handle]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setHandle(tempHandle);
        localStorage.setItem(`${id}-handle`, tempHandle);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={`${styles.card} ${styles.github}`}>
                <button
                    className={styles.settingsBtn}
                    onClick={() => setIsModalOpen(true)}
                    title="Edit Card"
                >
                    <Settings size={20} />
                </button>

                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <GitFork size={20} />
                    </div>
                    <span className={styles.rank}>Developer</span>
                </div>

                <div className={styles.mainInfo}>
                    <div className={styles.platform}>GitHub</div>
                    <div className={styles.ratingWrapper}>
                        <span className={styles.currentRating}>{loading ? '...' : stats.followers}</span>
                        <span className={styles.currentLabel}>Followers</span>
                    </div>
                </div>

                <div className={styles.stats}>
                    <div className={styles.statRow}>
                        <span>Public Repos</span>
                        <span className={styles.statValue}>{loading ? '...' : stats.repos}</span>
                    </div>
                    <div className={styles.statRow}>
                        <span>Following</span>
                        <span className={styles.statValue}>{loading ? '...' : stats.following}</span>
                    </div>
                    <div className={styles.statRow}>
                        <span>Last Active</span>
                        <span className={styles.statValue}>{loading ? '...' : stats.lastActive}</span>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Edit Settings</h3>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className={styles.formGroup}>
                                <label>GitHub Username</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={tempHandle}
                                    onChange={(e) => setTempHandle(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}