import Link from 'next/link'
import React from 'react'

export default function Seccion3() {
    return (
        <div>
                  {/* Sección de Ubicación */}
        <div className="bg-[#fdf9f6] min-h-screen flex items-center justify-center p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full items-center">
            {/* Texto */}
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Donde nos <br /> ubicamos?
                </h2>
                <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur <br /> 
                adipiscing elit.Lorem ipsum dolor sit amet.
                </p>
                <Link
                href={"https://www.google.com.mx/maps/place/Av.+Reforma+3529,+La+Paz,+72160+Heroica+Puebla+de+Zaragoza,+Pue./@19.0590663,-98.2272576,17z/data=!3m1!4b1!4m6!3m5!1s0x85cfc6d39bf72339:0x5b19b09552b887eb!8m2!3d19.0590663!4d-98.2246827!16s%2Fg%2F11c5m_ctjz?entry=ttu&g_ep=EgoyMDI1MDIxMi4wIKXMDSoASAFQAw%3D%3D"}>
                <button className="bg-[#0048ac] w-2/4 text-white px-6 py-3 shadow-md hover:bg-[#1e3442] transition">
                Vamos...
                </button>
                </Link>
            </div>
            {/* Mapa */}
            <div className="w-full h-80 rounded-lg overflow-hidden shadow-md">
                <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.106233372626!2d-98.2246827!3d19.059066299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cfc6d39bf72339%3A0x5b19b09552b887eb!2sAv.%20Reforma%203529%2C%20La%20Paz%2C%2072160%20Heroica%20Puebla%20de%20Zaragoza%2C%20Pue.!5e0!3m2!1ses!2smx!4v1739807242108!5m2!1ses!2smx" 
                width="100%" 
                height="100%" 
                style={{ border: "0" }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
            </div>
        </div>
        </div>
    )
}
