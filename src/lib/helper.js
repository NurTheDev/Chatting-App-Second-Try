import { getDatabase, ref, onValue } from "firebase/database";
import {getAuth } from "firebase/auth";
const fetchData =(callback)=>{
    const auth = getAuth();
    const db = getDatabase();
    const starCountRef = ref(db, 'users/');
    onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            if(callback && typeof callback === 'function'){
                Object.values(data).map((item)=>{
                    if(item.uid !== auth.currentUser.uid){
                        callback(Object.values(data));
                    }
                })
            }
        // return Object.values(data);
    });
}
export default fetchData;