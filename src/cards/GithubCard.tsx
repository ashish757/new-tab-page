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
        totalStars: '-',
        repos: '-',
        topLanguage: 'DEV',
        latestRepo: '-',
        followers: '-',
        lastActive: '-',
        weeklyCommits: '-'
    });

    const fetchStats = async (currentHandle: string) => {
        if (!currentHandle) return;
        setLoading(true);

        const newStats = { totalStars: '-', repos: '-', topLanguage: 'DEV', latestRepo: '-', followers: '-', lastActive: '-', weeklyCommits: '-' };

        try {
            const [profileRes, eventsRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${currentHandle}`),
                fetch(`https://api.github.com/users/${currentHandle}/events/public?per_page=100`),
                fetch(`https://api.github.com/users/${currentHandle}/repos?per_page=100&sort=pushed`)
            ]);

            if (profileRes.ok) {
                const profile = await profileRes.json();
                newStats.repos = profile.public_repos?.toString() || '0';
                newStats.followers = profile.followers?.toString() || '0';
            }

            if (reposRes.ok) {
                const repos = await reposRes.json();
                let stars = 0;
                const langCounts: Record<string, number> = {};

                repos.forEach((repo: any) => {
                    stars += repo.stargazers_count || 0;
                    if (repo.language) {
                        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
                    }
                });

                newStats.totalStars = stars.toString();

                let maxCount = 0;
                for (const [lang, count] of Object.entries(langCounts)) {
                    if (count > maxCount) {
                        maxCount = count as number;
                        newStats.topLanguage = lang.toUpperCase();
                    }
                }
            }

                if (eventsRes.ok) {

                    const events = await eventsRes.json();

                    console.log(events);

                    const lastPush = events.find((e: any) => e.type === 'PushEvent');
                    if (lastPush) {
                        newStats.latestRepo = lastPush.repo.name.split('/').pop();
                    } else {
                        newStats.latestRepo = 'None';
                    }

                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                    let commits = 0;
                    events.forEach((e: any) => {
                        if (e.type === 'PushEvent') {
                            const eventDate = new Date(e.created_at);
                            if (eventDate >= oneWeekAgo) {
                                const pushSize = e.payload?.size ?? e.payload?.commits?.length ?? 1;
                                commits += pushSize;
                            }
                        }
                    });
                    newStats.weeklyCommits = commits.toString();
                    newStats.lastActive = new Date(events[0].created_at).toLocaleDateString();

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
                <span className={"rank"}>GitHub</span>
            </div>

            <div className={"mainInfo"}>
                <div className={"ratingWrapper"}>
                    <div className={styles.platform}>{loading ? '...' : stats.topLanguage}</div>
                    <span className={styles.currentRating}>{loading ? '...' : stats.totalStars} Total Stars</span>
                </div>
                <div className={"nextRankWrapper"}>
                    <div>
                        Commits This week
                    </div>
                    <div>
                        {loading ? '...' : stats.weeklyCommits}
                    </div>
                </div>
            </div>

            <div className={"stats"}>
                <div className={"statRow"}>
                    <span>Public Repos</span>
                    <span className={"statValue"}>{loading ? '...' : stats.repos}</span>
                </div>
                <div className={"statRow"}>
                    <span>Followers</span>
                    <span className={"statValue"}>{loading ? '...' : stats.followers}</span>
                </div>
                <div className={"statRow"}>
                    <span>Last Push</span>
                    <span className={"statValue"}>{loading ? '...' : stats.latestRepo}</span>
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