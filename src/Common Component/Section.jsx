import PropTypes from "prop-types";
import React, {useEffect} from "react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import User from "./User";
import Skeleton from "./Skeleton";
import avatar from "../assets/avatar.gif";
import moment from "moment";
// import { getDatabase, ref, onValue } from "firebase/database";
const Section = ({ data, className, title, loadingState, buttonData }) => {
    // Create an array for skeleton placeholders
    const dataArray = Array.isArray(data) ? data : Object.values(data || {});
    const skeletonArray = Array(5).fill({});
    return (
        <div className="mt-8 px-5 rounded-[20px] bg-white shadow-lg w-full">
            <div className="flexRowBetween">
                <div className={"flex gap-x-4 font-semibold justify-center items-center"}>
                    <h2 className="text-xl font-semibold font-poppins">{title}</h2>
                    <span className={"font-poppins bg-primary-purple w-6 h-6 text-sm flex justify-center items-center text-white rounded-full"}>
            {loadingState ? '0' : data.length}
          </span>
                </div>
                <span className="cursor-pointer text-xl">
          <IoEllipsisVerticalSharp />
        </span>
            </div>
            <div className={`mt-4 ${className}`}>
                {loadingState ? (
                    <div>
                        {skeletonArray.map((_, index) => (
                            <div key={index}>
                                <Skeleton />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {dataArray.map((item, index) => (
                            <User
                                key={item.id || index}
                                uid={item.uid}
                                email={item.email}
                                img={item?.sender?.img || item.photoURL || item.avatar || avatar}
                                name={item.name || item.fullName || item?.sender?.name}
                                message={item.message || item.email}
                                time={item.time || moment(item.createdAt).fromNow() || "10:00 AM"}
                                button={item.button || buttonData}
                                className={
                                    index === data.length - 1
                                        ? "border-b-0"
                                        : "border-b border-b-gray-medium-35"
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

Section.propTypes = {
    data: PropTypes.array.isRequired,
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    loadingState: PropTypes.bool,
    buttonData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    currentUser: PropTypes.object,
};

export default Section;