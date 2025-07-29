import React from "react";
import { useUserActions } from "../../hooks/user.actions";
import Layout from "./Layout";
import MyEquipment from "../equipment/MyEquipment";

function Home() {
    const actions = useUserActions();

    return (
        <div>
            <Layout></Layout>
              <MyEquipment />
        </div>


    );
}

export default Home;