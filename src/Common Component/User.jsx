import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import { getDatabase, ref, set, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import moment from "moment";
import {Slide, toast} from "react-toastify";
import propTypes from "prop-types";
import fetchData from "../lib/helper.js";
const User = ({ img, name, message, button, time, className,  uid, email, IDs }) => {
    const auth = getAuth();
  const [activeUser, setActiveUser] = useState([]);
    const [buttonState, setButtonState] = React.useState(false);
  const db = getDatabase();
  const [loacalUsrId , setLocalUserId] = useState(null);
  useEffect(() => {
    fetchData((userData)=>{
      const currentUserData = userData.filter((data)=>{
        return data.uid === auth.currentUser?.uid;
      })
      setActiveUser(currentUserData);
    }, "users/", "owner");
  }, []);
  const handleButton = (data) => {
    setLocalUserId(data.uid+auth.currentUser.uid)
    // Accept of reject the friend request
    if(button === "Accept"){
      set(ref(db, 'FriendList/' + data.uid),{
        id: data.uid+auth.currentUser.uid,
        friend:{
            name: data.name,
            img: data.img,
            email: data.email,
            uid: data.uid,
        },
        whomFriend: {
          name: activeUser[0].fullName || auth.currentUser.displayName,
          img: activeUser[0].photoURL || auth.currentUser.photoURL,
          email: activeUser[0].email ||auth.currentUser.email,
          uid: auth.currentUser.uid,
        }, createdAt: moment().toISOString()
      })
    }
    // Handle the add friend action here
    if(!buttonState) {
      set(ref(db, 'FriendRequest/' + data.uid), {
        id: data.uid+auth.currentUser.uid,
        sender :{
          name: activeUser[0].fullName || auth.currentUser.displayName,
          img: activeUser[0].photoURL || auth.currentUser.photoURL,
          email: activeUser[0].email ||auth.currentUser.email,
          uid: auth.currentUser.uid,
        },
        receiver : {
          uid: data.uid,
          name: data.name,
          img: data.img,
          email: data.email,
        },
        createdAt: moment().toISOString(),
        sentRequest: true,
         notification: `${activeUser[0].fullName || auth.currentUser.displayName} sent you a friend request`,
      }).then(()=>{
        toast.success('Request sent successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      }).then(()=>{
        setButtonState(true);
      });
    } else if (buttonState){
      remove(ref(db, 'FriendRequest/' + data.uid)).then(()=>{
        toast.error('Friend Request Cancle', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });
        setButtonState(false);
      });
    }
  };
  return (
    <div
      className={`flex justify-between mx-5 items-center gap-4 font-poppins py-4  cursor-pointer hover:shadow-md ${className}`}
    >
      <div className="flex gap-4 items-center">
        <div>
          <img src={img} alt={img} className="rounded-full w-[70px] h-[70px]" />
        </div>
        <div className="flex flex-col ">
          <h3 className="text-lg font-semibold ">{name}</h3>
          {time && message || message && button ? (
            <p className="text-sm text-gray-dark">{message}</p>
          ) : (
            <p className="text-sm text-gray-dark">{time}</p>
          )}
        </div>
      </div>
      {time && button ? (
         <button onClick={()=>handleButton({
            uid: uid,
            name: name,
            img: img,
           email: email,
         })} className="text-white p-2 bg-primary-purple text-xl font-semibold rounded-md min-w-12 hover:scale-95 transition-all duration-200">
            {buttonState ? "Cancel" : button}
        </button>
      ) : (
        <p className="text-sm text-gray-dark">{time}</p>
      )}
    </div>
  );
};
User.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  time: PropTypes.string,
  className: PropTypes.string,
  uid: propTypes.string,
  email: PropTypes.string,
  IDs: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};
export default User;
