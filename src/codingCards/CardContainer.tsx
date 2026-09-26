import styles from './cardContainer.module.css';
import CodeforcesCard from './CodeforcesCard.tsx';
import ShortcutsCard from "./ShortcutsCard.tsx";
import GithubCard from "./GithubCard.tsx";



export default function CardContainer() {
    return (
        <div className={styles.container}>

            <div className={styles.grid}>
                <ShortcutsCard/>
                <GithubCard id={"card-github"} defaultHandle={"ashish757"}/>
                <CodeforcesCard id="card-codeforces" defaultHandle="Abnormality" />
            </div>
        </div>
    );
}