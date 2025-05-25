"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion"; 
import Image from "next/image";

function VerificationToken() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        if (!token) return;

        const confirmAccount = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/alumnos/confirmar/${token}`, {
                    method: "GET",
                });

                if (response.ok) {
                    setVerificationStatus("success");
                } else {
                    setVerificationStatus("error");
                }
            } catch (error) {
                console.error("Error confirming account:", error);
                setVerificationStatus("error");
            }
        };

        confirmAccount();
    }, [token]);

    const handlerPages = () => {
        router.push("/login");
    };

    const getMessage = () => {
        if (verificationStatus === "loading") {
            return "Verificando tu cuenta, por favor espera...";
        }
        if (verificationStatus === "success") {
            return "¡Tu cuenta ha sido verificada exitosamente! Ahora puedes iniciar sesión.";
        }
        if (verificationStatus === "error") {
            return "Hubo un problema al verificar tu cuenta. El enlace puede haber expirado o ya fue utilizado.";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-sans min-h-screen flex items-center justify-center bg-gray-100 px-4"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 max-w-5xl w-full p-6 shadow-lg bg-white rounded-xl">
                <div className="w-full p-6">
                    <p className="text-gray-700 mb-4 text-center text-sm md:text-base">
                        {getMessage()}
                    </p>

                    {verificationStatus !== "loading" && (
                        <button
                            onClick={handlerPages}
                            className="w-full bg-[#03003f] text-white py-2 rounded-md hover:bg-[#03003f] transition duration-200 ease-in-out"
                        >
                            Iniciar sesión
                        </button>
                    )}
                </div>

                <div className="hidden md:block md:h-full bg-[#03003f] rounded-xl p-6 md:p-12">
                    <Image
                        src="/udeaLogo2.jpg"
                        width={80} 
                        height={80}
                        className="w-full h-full object-cover rounded-xl"
                        alt="Verification illustration"
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default VerificationToken;
