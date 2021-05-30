import React, {useEffect, useState} from "react";
import styles from "./ChuckNorrisDialog.module.css"
import {useChuckNorrisApi} from "./ChuckNorrisApiContext";

export const ChuckNorrisDialog = () => {
    const apiClient = useChuckNorrisApi()
    const [randomJoke, setRandomJoke] = useState("")

    useEffect(() => {
        apiClient
            .randomJoke()
            .then(joke => setRandomJoke(joke.value))
    }, [apiClient])

    return <div className={styles.dialog}>{randomJoke}</div>
}
