import React, {useEffect, useState} from 'react';
import Searchbar from "../Common Component/Searchbar.jsx";
import fetchData from "../lib/helper.js";
import { getAuth } from "firebase/auth";

function Settings() {
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState([]);
    useEffect(() => {
        fetchData((userData)=>{
            setCurrentUser(userData);
        }, "users/", "owner");
    }, []);

    return (
        <div>
            <Searchbar/>
            <div className={`grid grid-cols-2 mt-10 gap-x-7`}>
                <div className={"bg-red-300 py-5 px-7 rounded-[20px] shadow-md"}><h3>Profile Settings</h3>
                    <div>
                        <div>
                            <picture>
                                <img className={"rounded-full w-24 h-24 "} src={currentUser[0]?.photoURL} alt={currentUser[0]?.photoURL}/>
                            </picture>
                        </div>
                        <div>
                            <h1>{currentUser[0]?.fullName}</h1>
                            <p>{currentUser[0].bio?(currentUser[0].bio) :"Set a Bio"}</p>
                        </div>
                    </div>
                </div>
                <div className={"bg-yellow-300 py-5 px-7 rounded-[20px] shadow-md"}>hello</div>
            </div>
        </div>
    );
}

export default Settings;