import React from 'react';
import {AlertTriangle} from 'lucide-react'; // using Lucide icons (very lightweight)

const UnderConstruction = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
            <div className="bg-yellow-100 p-6 rounded-full mb-4">
                <AlertTriangle className="text-yellow-600" size={60}/>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                This feature is still under construction
            </h1>
            <p className="text-gray-600 max-w-md">
                🛠️ Oops! Our developers are still fighting bugs here. Please come back with popcorn 🍿.
            </p>
        </div>
    );
};

export default UnderConstruction;
