import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import User from "../components/User";

import styles from './AppLayout.module.css';

const AppLayout = () => {
    return (
        <div className={styles.appLayout}>
            <Sidebar />
            <Map />
            <User />
        </div>
    )
};

export default AppLayout;
