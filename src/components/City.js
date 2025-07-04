import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCities } from "../contexts/contexts";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

import styles from "./City.module.css";

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
    }).format(new Date(date)
);

const City = () => {
    const {id} = useParams();
    const {getCity, currentCity, isLoading} = useCities();

    useEffect(() => {
        getCity(id);
    }, [id, getCity]);

    const {cityName, emoji, date, notes} = currentCity;

    // in my opinion this loading doesn't solve the issue he was trying to solve: current city is not reset after clicking on a different one
    //  so for a short moment the previous one is shown but he doesn't want to reset it because he needs to keep the previous 
    // currentCity when going back to the list so that it keeps the hihlighting (green border)
    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className={styles.city}>
            <div className={styles.row}>
                <h6>City name</h6>
                <h3>
                    <span>{emoji}</span> {cityName}
                </h3>
            </div>

            <div className={styles.row}>
                <h6>You went to {cityName} on</h6>
                <p>{formatDate(date || null)}</p>
            </div>

            {notes && (
                <div className={styles.row}>
                    <h6>Your notes</h6>
                    <p>{notes}</p>
                </div>
            )}

            <div className={styles.row}>
                <h6>Learn more</h6>
                <a
                    href={`https://en.wikipedia.org/wiki/${cityName}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    Check out {cityName} on Wikipedia &rarr;
                </a>
            </div>

            <div>
                <BackButton />
            </div>
        </div>
    );
};

export default City;
