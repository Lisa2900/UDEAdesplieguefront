"use client"

import { Search, BookOpen, Library, CircleHelp } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#ffffff] to-[#0077b6] px-4 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-5">
            <Library className="w-40 h-40 text-[#03045e]" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-5">
            <BookOpen className="w-40 h-40 text-[#03045e]" />
        </div>
        <div className="max-w-lg w-full text-center space-y-8 z-10">
            <div className="relative">
            <div className="absolute -top-8 -left-8 w-20 h-20 bg-[#03045e] rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <CircleHelp  className="h-10 w-10 text-white" />
            </div>

            <div className="bg-white p-10 rounded-xl shadow-2xl border border-[#e0f7fa]">
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-[#03045e] rounded-full flex items-center justify-center animate-bounce shadow-lg opacity-90">
                <span className="text-white font-bold text-xl">404</span>
                </div>

                <h1 className="text-5xl font-bold text-[#03045e] mb-2 tracking-tight">Página no encontrada</h1>
                <div className="h-1 w-20 bg-[#03045e] mx-auto my-4 rounded-full"></div>

                <div className="relative py-8">
                <div className="border-t border-[#e0f7fa] absolute w-full top-1/2 left-0"></div>
                <div className="relative bg-white px-4 inline-block">
                    <Search className="h-6 w-6 text-[#03045e]" />
                </div>
                </div>

                <p className="text-slate-600 mb-8 text-lg">
                Lo sentimos, la página que estás buscando no se encuentra en nuestra biblioteca virtual.
                </p>
            </div>
            </div>
        </div>
        </div>
    )
}
