import { Mail, Facebook, Instagram } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 text-black p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h2 className="font-bold text-lg">Un suspiro es necesario...</h2>
                    <p className="text-gray-500 mt-2">
                        400 Universidad de los ángeles <br />
                        Tecamachalco, <br />
                        Somos todos
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-gray-500 font-semibold">Filtros</h3>
                        <ul className="mt-2 space-y-2">
                            <li><a href="/login" className="hover:underline">Inicio</a></li>
                            <li><a href="#" className="hover:underline">Semestres</a></li>
                            <li><a href="#" className="hover:underline">Saber más...</a></li>
                            <li><a href="#" className="hover:underline">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-gray-500 font-semibold">Ayudas</h3>
                        <ul className="mt-2 space-y-2">
                            <li><a href="#" className="hover:underline">Soporte</a></li>
                            <li><a href="#" className="hover:underline">Asistente virtual</a></li>
                            <li><a href="#" className="hover:underline">Políticas de privacidad</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-gray-500 font-semibold">Comentarios</h3>
                        <div className="mt-2 flex items-center space-x-2 border-b border-gray-300 pb-1">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <input
                                type="email"
                                placeholder="Ingresa tu correo ..."
                                className="text-gray-500 outline-none text-sm bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
                <p className="text-gray-500 text-sm">2025 UDEA. Universidad De Los Angeles</p>
                <div className="flex space-x-6 mt-6 md:mt-0">
                    <a href="#" className="hover:text-gray-600">
                        <Instagram className="h-7 w-7" />
                    </a>
                    <a href="#" className="hover:text-gray-600">
                        <Facebook className="h-7 w-7" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
