import { useState, useEffect } from 'react';
import { Settings, X, Terminal } from 'lucide-react';
import styles from './codeforces.module.css';
import "./commonCard.css"

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
        lastActive: '-',
        nextRank: '-',
        width: 0,
        diff: 0
    });

    const ranks = [
        { id: 1, rank: 'Newbie', start: 0 },
        { id: 2, rank: 'Pupil', start: 1200 },
        { id: 3, rank: 'Specialist', start: 1400 },
        { id: 4, rank: 'Expert', start: 1600 },
        { id: 5, rank: 'Candidate Master', start: 1900 },
        { id: 6, rank: 'Master', start: 2100 },
        { id: 7, rank: 'International Master', start: 2300 },
        { id: 8, rank: 'Grandmaster', start: 2400 },
        { id: 9, rank: 'International Grandmaster', start: 2600 },
        { id: 10, rank: 'Legendary Grandmaster', start: 3000 },
        { id: 11, rank: 'Tourist', start: 4000 },
    ];

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

        let nextRank = '...';
        let diff = 0;
        let width = 0;

        const currRatingNum = Number(newStats.currentRating);

        if (!isNaN(currRatingNum)) {
            const nextRankIdx = ranks.findIndex(rank => rank.start > currRatingNum);

            if (nextRankIdx === -1) {
                nextRank = 'Max Rank';
                diff = 0;
                width = 100;
            } else if (nextRankIdx === 0) {
                nextRank = ranks[0].rank;
                diff = ranks[0].start - currRatingNum;
                width = 0;
            } else {
                nextRank = ranks[nextRankIdx].rank;
                diff = ranks[nextRankIdx].start - currRatingNum;
                const range = ranks[nextRankIdx].start - ranks[nextRankIdx - 1].start;
                const pointsEarned = currRatingNum - ranks[nextRankIdx - 1].start;
                width = (pointsEarned / range) * 100;
            }
        }

        setStats({ ...newStats, nextRank, width, diff });
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
                <div className={"ratingWrapper"}>
                    <span className={styles.rank}>{loading ? '...' : stats.rank}</span>
                    <div>
                        <span className={"currentRating"}>{loading ? '...' : stats.currentRating}</span>
                        <span className={"currentLabel"}>Current</span>
                    </div>
                </div>
                <div className={"nextRankWrapper"}>
                    <div className={styles.nextRank}>
                        <span>next </span>
                        <span>{stats.nextRank}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progress} style={{ width: `${stats.width}%` }}></div>
                    </div>
                    <div style={{ fontSize: ".8rem" }}>
                        {stats.diff} pts for next rank
                    </div>
                </div>
            </div>

            <div className={"stats"}>
                <div className={"statRow"}>
                    <span>Max Rating</span>
                    <span className={"statValue"}>{loading ? '...' : stats.maxRating}</span>
                </div>
                <div className={"statRow"}>
                    <span>Problems Solved</span>
                    <span className={"statValue"}>{loading ? '...' : stats.problemsSolved}</span>
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
        </div>
    );
}