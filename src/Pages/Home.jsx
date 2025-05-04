import React, {useEffect, useState} from "react";
import Searchbar from "../Common Component/Searchbar";
import Section from "../Common Component/Section";
import {getAuth} from "firebase/auth";
import {blockList, groupList,} from "../lib/Data";
import fetchData from "../lib/helper.js";
import {IoCloseCircleOutline} from "react-icons/io5";

const Home = () => {
    const auth = getAuth();
    const [user, setUser] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [friendRequest, setFriendRequest] = useState([]);
    const [friendlist, setFriendlist] = useState([]);
    const [requestID, setRequestID] = useState(null);
    const [createGroup, setCreateGroup] = React.useState(false);

    useEffect(() => {
        setLoading(true)
        fetchData((friendlist) => {
           const filteredFriendlist = friendlist.filter((friend) => {
               const userFriend = friend.id.includes(auth.currentUser.uid);
               return userFriend ? friend : null;
           })
            setFriendlist(filteredFriendlist);
            setLoading(false);
        }, "FriendList/");
    }, []);
    useEffect(() => {
        setLoading(true)
        fetchData((friendRequestData) => {
            const filteredRequests = friendRequestData.filter((request) => {
                return request.receiver.uid === auth.currentUser?.uid;
            })
            setFriendRequest(filteredRequests);
            setLoading(false);
        }, "FriendRequest/");
    }, []);
    console.log("friendRequest", friendRequest);
    useEffect(() => {
        if (friendRequest && friendRequest.length > 0) {
            const userIDs = friendRequest.map(request => request?.id);
            setRequestID(userIDs[0]);
        }
    }, [friendRequest]);
    useEffect(() => {
        setLoading(true)
        fetchData((userData) => {
            setUser(userData);
            setLoading(false);
        }, "users/");
    }, []);
    useEffect(() => {
        if (user.length && friendlist.length) {
            const friendIds = friendlist.map(friend => {
                return friend.friend?.uid === auth.currentUser.uid
                    ? friend.whomFriend?.uid
                    : friend.friend?.uid;
            });

            const filtered = user.filter(u => {
                if (u.uid === auth.currentUser.uid) return false;
                return !friendIds.includes(u.uid);
            });
            setFilteredUsers(filtered);
        } else if (user.length) {
            setFilteredUsers(user.filter(u => u.uid !== auth.currentUser.uid));
        }
    }, [user, friendlist]);

    return (
       <div className={"relative"}>
           <div className="grid grid-cols-3 justify-center items-center gap-x-5 w-full">
               <div className="w-full">
                   <Searchbar/>
                   <Section
                       title={"Group List"}
                       data={groupList}
                       className={
                           "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[32vh]"
                       }
                   />
               </div>
               <>
                   <Section
                       title={"Friends"}
                       data={friendlist}
                       loadingState={loading}
                       buttonData={"More"}
                       className={
                           "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                       }
                   />
               </>
               <>
                   <Section
                       title={"User List"}
                       data={filteredUsers}
                       loadingState={loading}
                       IDs={requestID ? requestID : null}
                       buttonData={"+"}
                       className={
                           "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                       }
                   />
               </>
               <>
                   <Section
                       title={"Friend  Request"}
                       data={friendRequest}
                       rejectBtn={true}
                       loadingState={loading}
                       buttonData={"Accept"}
                       className={
                           "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                       }
                   />
               </>
               <>
                   <Section
                       title={" Group"}
                       data={user}
                       group={true}
                       groupState ={setCreateGroup}
                       className={
                           "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                       }
                   />
               </>
               <>
                   <Section
                       title={"Blocked Users"}
                       data={blockList}
                       className={
                           "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                       }
                   />
               </>
           </div>
           <div
                className="absolute top-1/2 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
               <div className="relative p-4 w-full max-w-md max-h-full">
                   <div className="relative bg-white rounded-lg shadow-sm">
                       <button type="button"
                               className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                           <IoCloseCircleOutline className={"text-3xl"}/>
                           <span className="sr-only">Close modal</span>
                       </button>
                       <div className="p-4 md:p-5 text-center">
                           <h3 className="mb-5 text-lg font-normal text-gray-500 ">Are you sure
                               you want to delete this product?</h3>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    );
};

export default Home;
