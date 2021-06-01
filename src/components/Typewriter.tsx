import React from "react";
import Typeist from "react-typist";
import styles from "./ChuckNorrisDialog.module.css";

export const Typewriter = (props: { children: React.ReactNode }) => {
    return <Typeist
        cursor={{show: false}}
        key={Math.random()}
        avgTypingDelay={10}
        stdTypingDelay={5}
        className={styles.dialog}>{props.children}</Typeist>
}
