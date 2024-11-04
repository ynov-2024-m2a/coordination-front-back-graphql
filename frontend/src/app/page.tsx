'use client'

import styles from "./page.module.scss";
import DropdownMenu from "@/components/menu/DropdownMenu";

const Page = () => {
  return (
    <div className={styles.container}>
      <DropdownMenu />
      <main className={styles.page}>
        <h1>Page</h1>
      </main>
    </div>
  );
};

export default Page;