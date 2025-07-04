import { useCallback, useEffect, useReducer } from "react";
import { CitiesContext } from "./contexts";

const BASE_URL = 'http://localhost:8000';

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ''
};

const reducer = (state, action) => {
    switch(action.type) {
        case 'loading':
            return {
                ...state,
                isLoading: true
            };
        // 'cities/loaded' - naming convention in redux community
        case 'cities/loaded':
            return {
                ...state,
                isLoading: false,
                cities: action.payload
            };
        case 'city/loaded':
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload
            };
        case 'city/created':
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload
            };
        case 'city/deleted':
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter((city) => city.id !== action.payload),
                currentCity: {}
            };
        case 'rejected':
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        default:
            throw new Error('Unknown action type');
    }
};

const CitiesProvider = ({children}) => {
    const [{cities, isLoading, currentCity, error}, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        async function fetchCities() {
            dispatch({type: 'loading'});

            try {
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();

                dispatch({type: 'cities/loaded', payload: data});
            }
            catch {
                dispatch({type: 'rejected', payload: 'There was an error loading cities...'});
            }
        }

        fetchCities();
    }, []);

    // I could get the city details from the cities array that we have already so no need to fetch again 
    // but in case the city details are different from the ones in cities array (sometimes it can have more details etc.)
    const getCity = useCallback(async function getCity(id) {
        // we are reading the id from the URL so it is a string hence converting it to number here
        if (currentCity.id === Number(id)) return;

        dispatch({type: 'loading'});

        try {
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();

            dispatch({type: 'city/loaded', payload: data});
        } 
        catch {
            dispatch({type: 'rejected', payload: 'There was an error loading the city...'});
        }
    }, [currentCity.id]);

    async function createCity(newCity) {
        dispatch({type: 'loading'});

        try {
            const res = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();

            dispatch({type: 'city/created', payload: data});
        } 
        catch {
            dispatch({type: 'rejected', payload: 'There was an error creating the city...'});
        }
    }

    async function deleteCity(id) {
        dispatch({type: 'loading'});

        try {
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: 'DELETE'
            });

            dispatch({type: 'city/deleted', payload: id});
        } 
        catch {
            dispatch({type: 'rejected', payload: 'There was an error deleting the city...'});
        }
    }

    return (
        <CitiesContext.Provider value={{
            cities, isLoading, currentCity, error, getCity, createCity, deleteCity
        }}>
            {children}
        </CitiesContext.Provider>
    );
};

export {CitiesProvider};
