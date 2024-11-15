'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { CreateTokenSection } from '@/components/create-token-section'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export default function MemeCoinCreator() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Signed up with email:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold">Meme Coin Creator</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a
                href="#features"
                className="hover:text-yellow-300 transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="hover:text-yellow-300 transition-colors"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className="hover:text-yellow-300 transition-colors"
              >
                Testimonials
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6"
          {...fadeIn}
        >
          Create Your Own Meme Coin in Minutes!
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8"
          {...fadeIn}
          transition={{ delay: 0.2 }}
        >
          No coding required. Launch your meme coin and make it viral!
        </motion.p>
        <motion.button
          className="bg-yellow-400 text-purple-800 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-300 transition-colors"
          {...fadeIn}
          transition={{ delay: 0.4 }}
        >
          Get Started Now
        </motion.button>
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Image
            src="/placeholder.svg?height=300&width=600"
            alt="Meme Coin Creator"
            width={600}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
        </motion.div>
        <motion.a
          href="#features"
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 1,
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <ChevronDown size={32} />
        </motion.a>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white text-purple-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              'Easy to Use',
              'Customizable Designs',
              'Blockchain Integration',
              'Instant Launch to Market',
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-purple-100 p-6 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            {[
              'Choose a Meme Theme',
              'Customize Your Coin',
              'Launch to the Blockchain',
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-purple-800 p-6 rounded-lg text-center w-full md:w-1/3"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-bold mb-4">{index + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{step}</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CreateTokenSection />

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-purple-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Doge Lover', quote: 'Much wow! Very coin!' },
              {
                name: 'Pepe Fan',
                quote: 'Feels good man. Best meme coin ever!',
              },
              { name: 'Moon Hodler', quote: 'To the moon! 🚀' },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-purple-800 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <Image
                    src={`/placeholder.svg?height=50&width=50&text=${
                      index + 1
                    }`}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <span className="font-semibold">{testimonial.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Meme Coin Creator</h3>
              <p className="text-purple-300">
                The internet's most meme-worthy coin creator!
              </p>
            </div>
            <div className="flex space-x-4 mb-8 md:mb-0">
              <a
                href="#"
                className="text-purple-300 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-purple-300 hover:text-white transition-colors"
              >
                Discord
              </a>
              <a
                href="#"
                className="text-purple-300 hover:text-white transition-colors"
              >
                Telegram
              </a>
            </div>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-purple-800 text-white px-4 py-2 rounded-l-full focus:outline-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-yellow-400 text-purple-800 px-4 py-2 rounded-r-full font-semibold hover:bg-yellow-300 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  )
}
