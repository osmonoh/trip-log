import { useNavigate } from "react-router-dom";
import Button from "./Button";

const BackButton = () => {
    const navigate = useNavigate();

    const handleClickBack = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    return (
        <Button type="back" onClick={(e) => handleClickBack(e)}>
            &larr; Back
        </Button>

    );
};

export default BackButton;
