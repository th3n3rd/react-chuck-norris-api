import React from 'react';
import 'pokemon-font/css/pokemon-font.css'
import styles from './App.module.css'
import ChuckNorrisAvatar from './assets/chuck-norris.png'
import {ChuckNorrisDialog} from "./components/ChuckNorrisDialog";

function App() {
    return (
        <div className={styles.app}>
            <img src={ChuckNorrisAvatar} alt="chuck-norris-avatar"/>
            <ChuckNorrisDialog/>
        </div>
    );
}

export default App;
