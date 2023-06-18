import { useState, useEffect } from 'react';
import './App.css';

const isDev = false;

function App() {
    const [time, setTime] = useState(new Date().getTime());
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        console.log(localStorage);
        console.log(new Date(parseInt(localStorage.getItem('time')!)));
        setTime(localStorage.getItem('time') ? parseInt(localStorage.getItem('time')!) : new Date().getTime());
        setOffset(localStorage.getItem('offset') ? parseInt(localStorage.getItem('offset')!) : 0);
    }, []);

    useEffect(() => {
        const timerID = setInterval(
            () => setTime(time + 1000 * (isDev ? 500 : 1)),
            1000 / (isDev ? 10 : 1) // A tick happens every second
        );
        return function cleanup() {
            clearInterval(timerID);
        };
    });

    useEffect(() => {
        localStorage.setItem('time', time.toString());
        // console.log(new Date(time).getHours());
        if (new Date(time).getHours() >= 21) {
            setTime(new Date(time).setHours(0));
            setOffset(prevOffset => prevOffset + 3);
        }
    }, [time])

    useEffect(() => {
        localStorage.setItem('offset', offset.toString());
    }, [offset])

    function displayTime(date: Date = new Date(time)) {
        const hours = (date.getHours()) % 24;
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function displayDate(date: Date = new Date(time)) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year.toString().padStart(4, '0')}`;
    }

    function reset() {
        if (window.confirm('Are you sure you want to reset?')) {
            localStorage.clear();
            setTime(new Date().getTime());
            setOffset(0);
        }
    }

    return (
        <div className="app">
            {isDev && <button className="reset-button" onClick={reset}>
                Reset
            </button>}
            <div className="clock">
                <p>
                    {displayTime()}
                </p>
            </div>
            {isDev && <div className="information">
                <p>
                    Offset: +{offset} hours
                </p>
                <p>
                    Real time: {displayDate(new Date())} {displayTime(new Date())}
                </p>
            </div>}
        </div>
    );
}

export default App;
