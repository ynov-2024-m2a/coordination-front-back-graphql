'use client'

import MainContent from "@/components/mainContent/MainContent";
import styles from "./page.module.scss";

const Page = () => {
    return (
        <div className={styles.container}>
            <main className={styles.page}>
                <MainContent />
            </main>
        </div>
    );
};

export default Page;