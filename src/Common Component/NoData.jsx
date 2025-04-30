import {Ghost} from 'lucide-react'; // optional funny icon
import React from 'react';
import PropTypes from "prop-types";

const NoDataFound = ({message = "no data found"}) => {
    return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 p-4 h-full">
            <Ghost className="w-10 h-10 text-purple-500 mb-2"/>
            <p className="font-semibold">It's lonely here... 👻</p>
            <p className="text-sm">{message || "No friends were brave enough to show up!"}</p>
        </div>
    );
};
NoDataFound.propTypes = {
    message: PropTypes.string,
};

export default NoDataFound;
