import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ChuckNorrisApiProvider} from "./components/ChuckNorrisApiContext";
import {ChuckNorrisApiClient} from "./components/ChuckNorrisApi";

const apiClient = new ChuckNorrisApiClient("https://api.chucknorris.io")

ReactDOM.render(
  <React.StrictMode>
    <ChuckNorrisApiProvider apiClient={apiClient}>
        <App />
    </ChuckNorrisApiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
