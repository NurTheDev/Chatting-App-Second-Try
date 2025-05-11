import React from "react";

// eslint-disable-next-line react/prop-types
const UserSkeleton = ({ className }) => {
    return (
        <div
            className={`flex justify-between mx-5 items-center gap-4 py-4 cursor-pointer animate-pulse ${className}`}
        >
            <div className="flex gap-4 items-center">
                <div className="rounded-full bg-gray-300 w-[70px] h-[70px]" />
                <div className="flex flex-col gap-2">
                    <div className="w-32 h-4 bg-gray-300 rounded" />
                    <div className="w-48 h-3 bg-gray-200 rounded" />
                </div>
            </div>
            <div className="w-20 h-8 bg-gray-300 rounded-md" />
        </div>
    );
};

export default UserSkeleton;
