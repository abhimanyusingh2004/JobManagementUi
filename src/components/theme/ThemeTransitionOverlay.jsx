import { motion, AnimatePresence } from "framer-motion"

const lightBg = "oklch(1 0 0)"
const darkBg = "oklch(0.13 0.028 261.692)"

export function ThemeTransitionOverlay({ show, nextTheme }) {
  
  let currentTheme = "light"
  if (typeof window !== "undefined") {
    currentTheme = localStorage.getItem("vite-ui-theme") || "light"
  }

  const themeToUse = nextTheme || currentTheme
  const bgColor = themeToUse === "dark" ? lightBg : darkBg 

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          style={{ backgroundColor: bgColor }}
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ clipPath: "circle(0% at 100% 0%)" }}
          animate={{ clipPath: "circle(150% at 100% 0%)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  )
}
