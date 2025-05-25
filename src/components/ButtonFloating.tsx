"use client"

import { useState, useEffect } from "react"
import { useRef } from "react"

const predefinedQuestions = [
    {
        id: 1,
        question: "¿Cómo puedo buscar un libro?",
        answer:
        "Puedes buscar libros utilizando la barra de búsqueda en la parte superior de la página. Puedes buscar por título, autor o palabras clave.",
    },
    {
        id: 2,
        question: "¿Cómo puedo prestar un libro digital?",
        answer:
        "Para prestar un libro digital, selecciona el libro que deseas, haz clic en 'Prestar' y confirma el préstamo. El libro estará disponible en tu cuenta por 14 días.",
    },
    {
        id: 3,
        question: "¿Cuántos libros puedo prestar a la vez?",
        answer: "Puedes prestar hasta 5 libros digitales simultáneamente en nuestra biblioteca virtual.",
    },
    ]

    interface Message {
    id: string
    content: string
    role: "user" | "assistant"
    }

    export default function LibraryChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
        id: "1",
        content: "¡Hola! Soy el asistente de la biblioteca virtual. ¿En qué puedo ayudarte hoy?",
        role: "assistant",
        },
    ])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const handleOpen = () => {
        setIsVisible(true)
        setTimeout(() => setIsOpen(true), 50)
    }

    const handleClose = () => {
        setIsOpen(false)
        setTimeout(() => setIsVisible(false), 300)
    }

    const handleQuestionClick = (question: string, answer: string) => {
        setMessages((prev) => [
        ...prev,
        {
            id: Date.now().toString() + "-user",
            content: question,
            role: "user",
        },
        ])

        setTimeout(() => {
        setMessages((prev) => [
            ...prev,
            {
            id: Date.now().toString() + "-assistant",
            content: answer,
            role: "assistant",
            },
        ])
        }, 500)
    }

    useEffect(() => {
        if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages]) //Fixed dependency

    return (
        <div className="fixed bottom-4 right-4 z-50">
        {/* Botón flotante - Siempre visible pero con diferentes estilos */}
        <div className="relative">
            <button
            onClick={isOpen ? handleClose : handleOpen}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={`
                h-12 w-12 rounded-full shadow-lg flex items-center justify-center
                transition-all duration-300
                ${
                isOpen
                    ? "bg-[#0048ac] transform rotate-45"
                    : "bg-[#030240] hover:bg-[#0048ac] animate-pulse-soft hover:animate-none transform hover:scale-110"
                }
            `}
            >
            {isOpen ? (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
                </svg>
            )}
            </button>

            {/* Tooltip */}
            {showTooltip && !isOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-max">
                <div className="bg-[#0048ac] text-white text-sm py-1 px-3 rounded shadow-lg animate-fadeIn">
                ¿Necesitas ayuda?
                <div className="absolute w-2 h-2 bg-[#0048ac] transform rotate-45 bottom-[-4px] right-5"></div>
                </div>
            </div>
            )}
        </div>

        {/* Chatbot */}
        {isVisible && (
            <div
            className={`
                bg-white rounded-lg shadow-2xl w-72 md:w-80 absolute bottom-16 right-0
                transition-all duration-300 ease-in-out transform origin-bottom-right
                ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
            `}
            >
            {/* Encabezado */}
            <div className="bg-[#030240] rounded-t-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                <div className="bg-white p-1 rounded-full">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[#030240]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253"
                    />
                    </svg>
                </div>
                <h3 className="text-sm font-bold text-white">Asistente de Biblioteca</h3>
                </div>
                <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 rounded-full p-1 transition-colors
                    transform hover:scale-110 duration-200"
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            {/* Contenido de mensajes */}
            <div className="p-3 h-60 overflow-y-auto bg-gray-50">
                <div className="space-y-3">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                        className={`
                        max-w-[85%] rounded-lg p-2 text-sm
                        ${message.role === "user" ? "bg-[#030240] text-white" : "bg-[#0048ac] text-white"}
                        animate-slideIn
                    `}
                    >
                        {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-1">
                            <div className="bg-white h-5 w-5 rounded-full flex items-center justify-center text-[#030240] text-xs font-bold">
                            BV
                            </div>
                            <span className="text-xs font-medium text-gray-200">Biblioteca</span>
                        </div>
                        )}
                        <p>{message.content}</p>
                    </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Preguntas predefinidas */}
            <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
                <p className="text-xs text-gray-500 mb-2">Preguntas frecuentes:</p>
                <div className="grid gap-1.5">
                {predefinedQuestions.map((q) => (
                    <button
                    key={q.id}
                    className="text-left px-2 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 
                        rounded-md transition-all duration-200 text-[#0048ac]
                        hover:shadow-sm transform hover:scale-[1.02]"
                    onClick={() => handleQuestionClick(q.question, q.answer)}
                    >
                    {q.question}
                    </button>
                ))}
                </div>
            </div>
            </div>
        )}
        </div>
    )
}

