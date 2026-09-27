import { useState, useEffect } from 'react';
import { Settings, X, GitFork } from 'lucide-react';
import styles from './github.module.css';
import "./commonCard.css"

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
            <div className={`card ${styles.github}`}>
                <button
                    className={"settingsBtn"}
                    onClick={() => setIsModalOpen(true)}
                    title="Edit Card"
                >
                    <Settings size={20} />
                </button>

                <div className={"header"}>
                    <div className={"iconWrapper"}>
                        <GitFork size={20} />
                    </div>
                    <span className={"rank"}>Developer</span>
                </div>

                <div className={"mainInfo"}>
                    <div className={styles.platform}>GitHub</div>
                    <div className={styles.ratingWrapper}>
                        <span className={styles.currentRating}>{loading ? '...' : stats.followers}</span>
                        <span className={styles.currentLabel}>Followers</span>
                    </div>
                </div>

                <div className={"stats"}>
                    <div className={"statRow"}>
                        <span>Public Repos</span>
                        <span className={"statValue"}>{loading ? '...' : stats.repos}</span>
                    </div>
                    <div className={"statRow"}>
                        <span>Following</span>
                        <span className={"statValue"}>{loading ? '...' : stats.following}</span>
                    </div>
                    <div className={"statRow"}>
                        <span>Last Active</span>
                        <span className={"statValue"}>{loading ? '...' : stats.lastActive}</span>
                    </div>
                </div>
                {isModalOpen && (
                    <div className={"modalOverlay"}>
                        <div className={"modal"}>
                            <div className={"modalHeader"}>
                                <h3>Edit Settings</h3>
                                <button className={"closeBtn"} onClick={() => setIsModalOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave}>
                                <div className={"formGroup"}>
                                    <label>GitHub Username</label>
                                    <input
                                        type="text"
                                        className={"input"}
                                        value={tempHandle}
                                        onChange={(e) => setTempHandle(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className={"submitBtn"}>
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>


    );
}