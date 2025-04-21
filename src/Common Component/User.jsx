import PropTypes from "prop-types";
import React from "react";
import { getDatabase, ref, set, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import moment from "moment";
const User = ({ img, name, message, button, time, className, uid, email }) => {
    const auth = getAuth();
    const [buttonState, setButtonState] = React.useState(false);
  const db = getDatabase();
  const handleAddFriend = (data) => {
    // Handle the add friend action here
    if(!buttonState) {
      set(ref(db, 'FriendRequest/' + data.uid), {
        id: data.uid+auth.currentUser.uid,
        sender :{
          name: auth.currentUser.displayName,
          img: auth.currentUser.photoURL,
          email: auth.currentUser.email,
          uid: auth.currentUser.uid,
        },
        receiver : {
          uid: data.uid,
          name: data.name,
          img: data.img,
          email: data.email,
        },
        createdAt: moment().format('MMMM Do YYYY, h:mm:ss a')
      }).then(()=>{
        alert("Friend request sent");
      }).then(()=>{
        setButtonState(true);
      });
    } else if (buttonState){
      remove(ref(db, 'FriendRequest/' + data.uid)).then(()=>{
        alert("Friend request cancelled");
        setButtonState(false);
      });
    }
  };
  console.log(buttonState)
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
         <button onClick={()=>handleAddFriend({
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
};
export default User;
