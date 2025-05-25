"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Menu, BookMarked } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [showWelcome, setShowWelcome] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const menuItems = [
   
    {
      id: "books",
      path: "/admin/Navegacion",
      title: "Libros",
      icon: <BookMarked  className="h-5 w-5" />,
      description: "Administración de libros",
      color: "from-green-500 to-emerald-500",
    },
  ]

  // Determinar si una ruta está activa
  const isActive = (path: string) => {
    return pathname === path
  }

  const handleOptionClick = (index: number) => {
    setSelectedOption(index)
    setIsTransitioning(true)

    setTimeout(() => {
      setShowWelcome(false)
      router.push(menuItems[index].path)
    }, 800)
  }

  useEffect(() => {
    if (pathname === "/admin") {
      setShowWelcome(true)
    } else if (pathname.startsWith("/admin/")) {
      setShowWelcome(false)
    }
  }, [pathname])

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <AnimatePresence mode="wait">
          {!showWelcome && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isSidebarOpen ? 280 : 80, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`border-r border-gray-200 h-screen relative ${
                isSidebarOpen ? "p-6" : "p-4"
              } bg-gray-50`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`font-semibold transition-all ${
                    isSidebarOpen ? "text-xl opacity-100" : "text-xs opacity-0"
                  }`}
                >
                  Admin Panel
                </h2>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg hover:bg-[#0048ac] transition-colors"
                >
                  {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
              <nav className="space-y-2">
                <AnimatePresence>
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{
                        opacity: 0,
                        x: -100,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                      }}
                      transition={{
                        delay: index * 0.2,
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                      }}
                      whileHover={{
                        scale: 1.05,
                        x: isSidebarOpen ? 10 : 0,
                        transition: { duration: 0.2 },
                      }}
                      className="relative"
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r opacity-0 hover:opacity-10 rounded-lg transition-opacity duration-300 ease-in-out"
                        style={{
                          background: `linear-gradient(to right, transparent, var(--${item.color}))`,
                        }}
                      />
                      <Link
                        href={item.path}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center
                          ${!isSidebarOpen ? "justify-center p-2" : ""}
                          hover:bg-[#0048ac] relative group
                          ${isActive(item.path) ? "bg-[#0048ac] text-white font-medium" : ""}`}
                      >
                        <motion.div className="relative z-10 flex items-center" whileHover={{ scale: 1.1 }}>
                          {item.icon}
                          {isSidebarOpen && (
                            <motion.span
                              className="ml-3 relative"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </motion.div>
                        {isSidebarOpen && (
                          <motion.div
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <ChevronLeft className="h-4 w-4 rotate-180" />
                          </motion.div>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {showWelcome ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <motion.h1
                    className="text-4xl font-bold mb-4 text-gray-900"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Bienvenido, Administrator
                  </motion.h1>
                  <motion.p
                    className="text-xl text-gray-900"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    ¿Qué te gustaría hacer hoy?
                  </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{
                        opacity: isTransitioning && selectedOption === index ? 0 : 1,
                        scale: isTransitioning && selectedOption === index ? 0.8 : 1,
                        y: 0,
                        x: isTransitioning && selectedOption === index ? -300 : 0,
                        rotateY: isTransitioning && selectedOption === index ? -45 : 0,
                      }}
                      exit={
                        selectedOption === index
                          ? {
                              x: -300,
                              opacity: 0,
                              scale: 0.5,
                              rotateY: -45,
                              transition: {
                                duration: 0.8,
                                ease: "easeInOut",
                              },
                            }
                          : {
                              opacity: 0,
                              scale: 0.8,
                              y: 50,
                              transition: {
                                duration: 0.4,
                                delay: index * 0.1,
                              },
                            }
                      }
                      transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                      className="perspective-1000"
                    >
                      <div
                        onClick={() => handleOptionClick(index)}
                        className={`cursor-pointer transition-all duration-300 transform-gpu
                          bg-white rounded-xl shadow-lg hover:shadow-xl
                          border border-[#0048ac]
                          ${isTransitioning && selectedOption === index ? "scale-95" : ""}`}
                      >
                        <div
                          className={`absolute inset-0 opacity-0 hover:opacity-10 rounded-lg transition-opacity duration-300
                          bg-gradient-to-r ${item.color}`}
                        />
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.4 }}>
                              {item.icon}
                            </motion.div>
                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          </div>
                          <p className="text-[#050140]">{item.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

