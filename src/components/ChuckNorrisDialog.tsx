import React, {useCallback, useEffect, useState} from "react";
import styles from "./ChuckNorrisDialog.module.css";
import {useChuckNorrisApi} from "./ChuckNorrisApiContext";

export const ChuckNorrisDialog = () => {
    const apiClient = useChuckNorrisApi()
    const [randomJoke, setRandomJoke] = useState("")
    const [errorOccurred, setErrorOccurred] = useState(false)

    const nextRandomJoke = useCallback(() => {
        apiClient
            .randomJoke()
            .then(joke => {
                setErrorOccurred(false)
                setRandomJoke(joke.value)
            })
            .catch(() => setErrorOccurred(true))
    }, [apiClient]);

    useEffect(() => {
        nextRandomJoke()
    }, [nextRandomJoke])

    return <div className={`${styles.container} ${errorOccurred ? styles.error : ""}`}>
        {errorOccurred && <span role={"alert"} className={styles.dialog}>Ouch, looks like Chuck Norris broke this page ... it may never recover</span>}
        {!errorOccurred && <span className={styles.dialog}>{randomJoke}</span>}
        <button className={styles.button} onClick={() => nextRandomJoke()}>{errorOccurred ? "Retry" : "Next"}</button>
    </div>
}
