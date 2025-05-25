import React from 'react';

const Modal = ({ isVisible, closeModal, selectedCard }) => {
    if (!isVisible || selectedCard === null) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
        <div className="bg-gray-100 p-6 rounded-2xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Saber más...</h2>
            <p className="text-gray-600 mb-6 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <button
            onClick={closeModal}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-700 transition"
            >
            Ok
            </button>
        </div>
        </div>
    );
    };

export default Modal;