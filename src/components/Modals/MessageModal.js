import React, { useState } from "react";
import { X, Bot, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MessageModal = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hola, ¿en qué puedo ayudarte?" },
        { sender: "user", text: "¿Cuál es el horario de atención?" },
        { sender: "bot", text: "Nuestro horario de atención es de 9 AM a 6 PM." }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim() === "") return;
        setMessages([...messages, { sender: "user", text: input }]);
        setInput("");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 sm:items-center sm:pt-0"
                initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-80 sm:w-96 h-auto bg-white shadow-lg p-4 flex flex-col rounded-lg
                                    sm:absolute sm:top-16 sm:right-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header */}
                        <div className="flex items-center border-b border-black pb-4">
                            <Bot className="w-12 h-12 text-gray-700" />
                            <div className="ml-3">
                                <h2 className="text-lg font-semibold">Hola, ¿en qué puedo ayudarte?</h2>
                            </div>
                            <button onClick={onClose} className="ml-auto">
                                <X className="w-6 h-6 text-gray-700 hover:text-red-500" />
                            </button>
                        </div>

                        {/* Historial de Mensajes */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
                            {messages.map((msg, index) => (
                                <div 
                                    key={index} 
                                    className={`flex items-center ${
                                        msg.sender === "bot" ? "justify-start" : "justify-end"
                                    }`}
                                >
                                    {msg.sender === "bot" && (
                                        <Bot className="w-5 h-5 text-gray-500 mr-2" />
                                    )}
                                    <div className={`p-2 rounded-lg max-w-xs text-sm ${
                                        msg.sender === "bot" ? "bg-gray-200 text-gray-900" : "bg-gray-200 text-gray-900"
                                    }`}>
                                        {msg.text}
                                    </div>
                                    {msg.sender === "user" && (
                                        <User className="w-5 h-5 text-gray-500 ml-2" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Input para escribir */}
                        <div className="border-t border-gray-300 pt-3 flex items-center px-2">
                            <input
                                type="text"
                                placeholder="Escribe lo que necesitas..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg outline-none text-sm"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <button onClick={handleSend} className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MessageModal;
