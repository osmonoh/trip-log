import { useCities } from '../contexts/contexts';
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';
import styles from './CountryList.module.css';

const CountryList = () => {
    const {cities, isLoading} = useCities();

    if (isLoading) {
        return <Spinner />;
    }

    if (!cities.length) {
        return <Message message="Add your first city by clicking on a city on the map" />;
    }

    const countries = cities.reduce((arr, city) => {
        if (!arr.find((el) => el.country === city.country)) {
            return [...arr, {country: city.country, emoji: city.emoji}];
        }
        else return arr;
    }, []);

    return (
        <ul className={styles.countryList}>
            {countries.map((country) => (
                <CountryItem country={country} key={country.country}/>
            ))}
        </ul>
    );
};

export default CountryList;
