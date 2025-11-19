import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/70 to-slate-900 pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}} className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          Smriti Cards
        </motion.h1>
        <motion.p initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.8}} className="mt-4 text-blue-100 text-lg">
          AI-powered flashcards that help you learn faster. Generate decks from any topic in seconds.
        </motion.p>
      </div>
    </section>
  )
}
