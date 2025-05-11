import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {getDatabase, push, ref, remove, set, update} from "firebase/database";
import {getAuth} from "firebase/auth";
import moment from "moment";
import {Slide, toast} from "react-toastify";
import fetchData from "../lib/helper.js";

const User = ({img, name, message, button, time, className, uid, email, rejectionBtn, userData}) => {
    const auth = getAuth();
    const [activeUser, setActiveUser] = useState([]);
    const [buttonState, setButtonState] = React.useState(false);
    const [showMore, setShowMore] = useState(false);
    const db = getDatabase();
    useEffect(() => {
        fetchData((userData) => {
            const currentUserData = userData.filter((data) => {
                return data.uid === auth.currentUser?.uid;
            })
            setActiveUser(currentUserData);
        }, "users/", "owner");
    }, []);
    const handleAccept = () => {
        if (button === "Accept" && userData) {
            set(ref(db, 'FriendList/' + userData.id), {
                id: userData.sender.uid + auth.currentUser.uid,
                friend: {
                    name: userData.sender.name,
                    img: userData.sender.img,
                    email: userData.sender.email,
                    uid: userData.sender.uid,
                },
                whomFriend: {
                    name: activeUser[0]?.fullName || auth.currentUser.displayName,
                    img: activeUser[0]?.photoURL || auth.currentUser.photoURL,
                    email: activeUser[0]?.email || auth.currentUser.email,
                    uid: auth.currentUser.uid,
                },
                createdAt: moment().toISOString(),
                isFriend: true,
            }).then(() => {
                remove(ref(db, 'FriendRequest/' + userData.id)).then(() => {
                    update(ref(db, "users/" + userData.receiver.uid), {
                        isFriend: true,
                    }).then(() => (
                        update(ref(db, "users/" + userData.sender.uid), {
                            isFriend: true,
                        }).then(() => {
                            console.log("Friend List Updated")
                        })
                    ));
                }).then(() => {
                    set(push(ref(db, 'Notification/')), {
                        message: `${activeUser[0]?.fullName || auth.currentUser.displayName} accepted your friend request`,
                    })
                })
                toast.success('Friend Request Accepted', {
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
            });
        }
    };
    const handleReject = () => {
        if (userData && userData.receiver && userData.sender) {
            remove(ref(db, 'FriendRequest/' + userData.receiver.uid)).then(() => {
                toast.error('Friend Request Rejected', {
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
            }).then(() => {
                set(push(ref(db, 'Notification/')), {
                    message: `${activeUser[0]?.fullName || auth.currentUser.displayName} rejected your friend request`,
                })
            }).catch(err => console.log("Error in removing friend request", err));
        }
    }
    const handleButton = (data) => {
        // console.log(data.target.textContent.includes("Unfriend"))
        if (data?.target?.textContent.includes("Unfriend")) {
            setButtonState(false);
            remove(ref(db, 'FriendList/' + userData.whomFriend?.uid)).then(() => {
                toast.success('Unfriend Successfully', {
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
            }).then(() => {
                set(ref(db, 'Notification/' + data.uid), {
                    notification : {
                        message3: `${activeUser[0]?.fullName || auth.currentUser.displayName} unfriended you`,
                    }
                })
            })
        }
        if (button === "More") {
            // Handle the more action here
            setShowMore(!showMore);
        }
        if (button === "Accept") {
            handleAccept();
        } else {
            // Handle the add friend action here
            if (!buttonState) {
                console.log(data.uid)
                set(ref(db, 'FriendRequest/' + data.uid + auth.currentUser.uid), {
                    id: data.uid + auth.currentUser.uid,
                    sender: {
                        name: activeUser[0]?.fullName || auth.currentUser.displayName,
                        img: activeUser[0]?.photoURL || auth.currentUser.photoURL,
                        email: activeUser[0]?.email || auth.currentUser.email,
                        uid: auth.currentUser.uid,
                    },
                    receiver: {
                        uid: data.uid,
                        name: data.name,
                        img: data.img,
                        email: data.email,
                    },
                    createdAt: moment().toISOString(),
                    sentRequest: true,
                }).then(() => {
                    set(ref(db, 'Notification/' + data.uid + auth.currentUser.uid), {
                        notification : {
                            message: `${activeUser[0]?.fullName || auth.currentUser.displayName} sent you a friend request`,
                        }
                    }).then(() => {
                        console.log("Notification sent")
                    })
                }).then(() => {
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
                    setButtonState(true);
                });
            } else if (buttonState) {
                remove(ref(db, 'FriendRequest/' + data.uid + auth.currentUser.uid)).then(() => {
                    toast.error('Friend Request Canceled', {
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
        }
    };
    return (
        <div
            className={`flex justify-between mx-5 items-center gap-4 font-poppins py-4 cursor-pointer hover:shadow-md ${className}`}
        >
            <div className="flex gap-4 items-center">
                <div>
                    <img src={img} alt={img} className="rounded-full w-[70px] h-[70px]"/>
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
            <div className="flex gap-2">
                {time && button && (
                    <button
                        onClick={() => handleButton({
                            uid: uid,
                            name: name,
                            img: img,
                            email: email,
                        })}
                        className="text-white p-2 bg-primary-purple text-xl font-semibold rounded-md min-w-12 hover:scale-95 transition-all duration-200"
                    >
                        {button === "Accept" ? "Accept" : (buttonState ? "Cancel" : button)}
                    </button>
                )}
                {showMore && (
                    <div className={"relative"}>
                        <div
                            className={"absolute right-0 -top-5 w-40 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10 "}>
                            <button
                                onClick={() => setShowMore(false)}
                                className="absolute top-1 right-1 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <span className="text-xs font-medium">✕</span>
                            </button>
                            <ul className={"space-y-2 mt-4 "}>
                                <li className={"hover:bg-gray-100 rounded px-3 py-2 transition-colors flex items-center"}>
                                    <i className="mr-2 text-sm">👤</i> View profile
                                </li>
                                <li className={"hover:bg-gray-100 rounded px-3 py-2 transition-colors flex items-center"}>
                                    <i className="mr-2 text-sm">💬</i> Message
                                </li>
                                <li className={"hover:bg-gray-100 rounded px-3 py-2 transition-colors flex items-center"}>
                                    <i className="mr-2 text-sm">🚫</i> Block
                                </li>
                                <li onClick={
                                    handleButton
                                } className={"hover:bg-gray-100 rounded px-3 py-2 transition-colors flex items-center"}>
                                    <i className="mr-2 text-sm">❌</i> Unfriend
                                </li>
                            </ul>
                        </div>
                    </div>

                )}
                {rejectionBtn && button === "Accept" && (
                    <button
                        onClick={handleReject}
                        className="text-white p-2 bg-red-500 text-xl font-semibold rounded-md min-w-12 hover:scale-95 transition-all duration-200"
                    >
                        Reject
                    </button>
                )}
                {!time && !button && (
                    <p className="text-sm text-gray-dark">{time}</p>
                )}
            </div>
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
    uid: PropTypes.string,
    email: PropTypes.string,
    IDs: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    userData: PropTypes.object,
    rejectionBtn: PropTypes.bool,
};
export default User;
