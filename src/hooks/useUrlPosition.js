import { useSearchParams } from "react-router-dom";

// custom hook to get lat, lng from search params
export const useUrlPosition = () => {
    const [searchParams] = useSearchParams();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    return [lat, lng];
};
