// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/contexts";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";

import styles from "./Form.module.css";

const convertToEmoji = (countryCode) => {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
    const navigate = useNavigate();
    const [lat, lng] = useUrlPosition();
    const {createCity, isLoading} = useCities();

    const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [emoji, setEmoji] = useState("");
    const [geocodingError, setGeocodingError] = useState("");

    // making it async because of the redirect: I want navigate() to wait until newCity is posted (await createCity())
    async function handleSubmit (e) {
        e.preventDefault();

        if (!cityName || !date) return;

        const newCity = {
            cityName,
            country,
            emoji,
            date,
            notes,
            position: {lat, lng}
        };

        await createCity(newCity);
        navigate('/app/cities');
    }

    useEffect(() => {
        if (!lat && !lng) return;

        async function fetchCityData() {
            try {
                setIsLoadingGeocoding(true);
                setGeocodingError('');

                const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
                const data = await res.json();

                if (!data.countryCode) {
                    throw new Error('That does not seem to be a city. Try to click somewhere else.')
                };

                setCityName(data.city || data.locality || '');
                setCountry(data.countryName);
                setEmoji(convertToEmoji(data.countryCode));
            }
            catch (err) {
                setGeocodingError(err.message);
            }
            finally {
                setIsLoadingGeocoding(false);
            }
        }

        fetchCityData();
    }, [lat, lng]);

    if (isLoadingGeocoding) {
        return <Spinner />;
    }

    if (!lat && !lng) {
        return <Message message="Start by clicking somewhere on the map." />;
    }

    if (geocodingError) {
        return <Message message={geocodingError} />;
    }

    return (
        <form className={`${styles.form} ${isLoading ? styles.loading: ''}`} onSubmit={handleSubmit}>
        <div className={styles.row}>
            <label htmlFor="cityName">City name</label>
            <input
                id="cityName"
                onChange={(e) => setCityName(e.target.value)}
                value={cityName}
            />
            <span className={styles.flag}>{emoji}</span>
        </div>

        <div className={styles.row}>
            <label htmlFor="date">When did you go to {cityName}?</label>

            <DatePicker id="date" onChange={(date) => setDate(date)} selected={date} dateFormat="dd/MM/yyyy" />
        </div>

        <div className={styles.row}>
            <label htmlFor="notes">Notes about your trip to {cityName}</label>
            <textarea
                id="notes"
                onChange={(e) => setNotes(e.target.value)}
                value={notes}
            />
        </div>

        <div className={styles.buttons}>
            <Button type="primary">Add</Button>

            {/* here the back button works weirdly when for example before a different place on the map was clicked
            or there was an error it goes back to that event and not to cities or countries (some other solution should be found) */}
            <BackButton />
        </div>
        </form>
    );
};

export default Form;
