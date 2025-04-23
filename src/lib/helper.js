import { getDatabase, ref, onValue } from "firebase/database";
import {getAuth } from "firebase/auth";
const fetchData =(callback, usedData, owner)=>{
    const auth = getAuth();
    const db = getDatabase();
    const starCountRef = ref(db, usedData);
    onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            if(callback && typeof callback === 'function'){
                const filteredData = Object.values(data).filter((item)=>{
                    return auth.currentUser && item.uid !== auth.currentUser.uid;
                })
                callback(filteredData);
            }
            if(owner && typeof callback === 'function'){
                const filteredData = Object.values(data).filter((item)=>{
                    return auth.currentUser && item.uid === auth.currentUser.uid;
                })
                callback(filteredData);
            }
    });
}
export default fetchData;