import React, {useCallback, useEffect, useState} from "react";
import styles from "./ChuckNorrisDialog.module.css";
import {useChuckNorrisApi} from "./ChuckNorrisApiContext";
import {Typewriter} from "./Typewriter";

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

    const prompt = errorOccurred
        ? "Ouch, looks like Chuck Norris broke this page ... it may never recover"
        : randomJoke

    return <div role={errorOccurred ? "alert" : "none"} className={`${styles.container} ${errorOccurred ? styles.error : ""}`}>
        <Typewriter>{prompt}</Typewriter>
        <button className={styles.button} onClick={() => nextRandomJoke()}>{errorOccurred ? "Retry" : "Next"}</button>
    </div>
}
