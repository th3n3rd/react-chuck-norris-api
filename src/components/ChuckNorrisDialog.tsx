import React, {useCallback, useEffect, useState} from "react";
import styles from "./ChuckNorrisDialog.module.css";
import {useChuckNorrisApi} from "./ChuckNorrisApiContext";

export const ChuckNorrisDialog = () => {
    const apiClient = useChuckNorrisApi()
    const [randomJoke, setRandomJoke] = useState("")

    const nextRandomJoke = useCallback(() => {
        apiClient
            .randomJoke()
            .then(joke => setRandomJoke(joke.value))
    }, [apiClient]);

    useEffect(() => {
        nextRandomJoke()
    }, [nextRandomJoke])

    return <div className={styles.container}>
        <span className={styles.dialog}>{randomJoke}</span>
        <button className={styles.button} onClick={() => nextRandomJoke()}>Next</button>
    </div>
}
