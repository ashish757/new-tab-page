import { useState, useEffect } from 'react';
import { Settings, X, Terminal } from 'lucide-react';
import styles from './codeforces.module.css';

interface Props {
    id: string;
    defaultHandle: string;
}

export default function CodeforcesCard({ id, defaultHandle }: Props) {
    const [handle, setHandle] = useState(() => localStorage.getItem(`${id}-handle`) || defaultHandle);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempHandle, setTempHandle] = useState(handle);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        rank: '-',
        currentRating: '-',
        maxRating: '-',
        problemsSolved: '-',
        lastActive: '-'
    });

    const fetchStats = async (currentHandle: string) => {
        if (!currentHandle) return;
        setLoading(true);

        const newStats = { rank: '-', currentRating: '-', maxRating: '-', problemsSolved: '-', lastActive: '-' };

        try {
            const infoReq = await fetch(`https://codeforces.com/api/user.info?handles=${currentHandle}`);
            const info = await infoReq.json();
            const data = info?.result?.[0];

            const statusReq = await fetch(`https://codeforces.com/api/user.status?handle=${currentHandle}&from=1&count=10000`);
            const status = await statusReq.json();

            if (data) {
                newStats.rank = data.rank ? data.rank.charAt(0).toUpperCase() + data.rank.slice(1) : '-';
                newStats.currentRating = data.rating || '-';
                newStats.maxRating = data.maxRating || '-';

                if (status.status === "OK" && status.result) {
                    const solvedProblems = new Set();
                    status.result.forEach((submission: any) => {
                        if (submission.verdict === "OK") {
                            solvedProblems.add(`${submission.problem.contestId}${submission.problem.index}`);
                        }
                    });
                    newStats.problemsSolved = solvedProblems.size.toString();

                    newStats.lastActive = status.result[0]?.creationTimeSeconds
                        ? new Date(status.result[0].creationTimeSeconds * 1000).toLocaleDateString()
                        : '-';
                }
            }
        } catch (e) {
            console.error("Failed to fetch Codeforces stats", e);
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
            <div className={`card ${styles.codeforces}`}>
                <button
                    className={"settingsBtn"}
                    onClick={() => setIsModalOpen(true)}
                    title="Edit Card"
                >
                    <Settings size={20} />
                </button>

                <div className={"header"}>
                    <div className={"iconWrapper"}>
                        <Terminal size={20} />
                    </div>
                    <div className={styles.platform}>Codeforces</div>
                </div>

                <div className={"mainInfo"}>
                    <div className={styles.ratingWrapper}>
                        <span className={styles.rank}>{loading ? '...' : stats.rank}</span>
                        <span className={styles.currentRating}>{loading ? '...' : stats.currentRating}</span>
                        <span className={styles.currentLabel}>Current</span>
                    </div>
                </div>

                <div className={styles.stats}>
                    <div className={styles.statRow}>
                        <span>Max Rating</span>
                        <span className={styles.statValue}>{loading ? '...' : stats.maxRating}</span>
                    </div>
                    <div className={styles.statRow}>
                        <span>Problems Solved</span>
                        <span className={styles.statValue}>{loading ? '...' : stats.problemsSolved}</span>
                    </div>
                    <div className={styles.statRow}>
                        <span>Last Active</span>
                        <span className={styles.statValue}>{loading ? '...' : stats.lastActive}</span>
                    </div>
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
                                <label>Codeforces Handle</label>
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
        </>
    );
}