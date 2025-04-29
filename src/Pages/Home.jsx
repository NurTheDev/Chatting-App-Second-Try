import React, {useEffect, useState} from "react";
import Searchbar from "../Common Component/Searchbar";
import Section from "../Common Component/Section";
import {getAuth} from "firebase/auth";
import {blockList, groupList,} from "../lib/Data";
import fetchData from "../lib/helper.js";

const Home = () => {
    const auth = getAuth();
    const [user, setUser] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [friendRequest, setFriendRequest] = useState([]);
    const [friendlist, setFriendlist] = useState([]);
    useEffect(() => {
        setLoading(true)
        fetchData((friendlist) => {
            setFriendlist(friendlist);
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

    // Filter user list to remove users already in friendlist and the current user
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
    const [requestID, setRequestID] = useState(null);

    return (
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
                    buttonData={"block"}
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
    );
};

export default Home;
