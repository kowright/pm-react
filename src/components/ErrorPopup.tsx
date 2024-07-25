import React from "react";

export interface ErrorPopupProps {
    setPopupVisibility: () => void;
    content: JSX.Element; 
}

export const ErrorPopup = ({
    ...props
}: ErrorPopupProps) => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-800 bg-opacity-50">
            <p className="bg-white p-6 rounded-lg shadow-lg h-40 mx-auto h-fit flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-4 flex text-red text-center">ERROR</h2>
                    {props.content}
                </div>
            </p>
        </div>
    );
};

export default ErrorPopup;
