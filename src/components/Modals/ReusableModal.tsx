import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ReusableModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const ReusableModal: React.FC<ReusableModalProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
        {isOpen && (
            <motion.div
            className="fixed inset-0 w-screen h-screen bg-black bg-opacity-40 flex justify-end z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            >
            <motion.div
                className="bg-white w-80 sm:w-96 h-full shadow-lg p-4 flex flex-col rounded-lg"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                {/* Encabezado del Modal */}
                <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button onClick={onClose}>
                    <X className="w-6 h-6 text-gray-700 hover:text-red-500" />
                </button>
                </div>

                {/* Contenido dinámico */}
                <div className="flex-1 overflow-y-auto p-4">{children}</div>

                
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

export default ReusableModal;