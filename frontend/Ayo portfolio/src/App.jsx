import React, { useEffect, useRef, useState } from 'react'

const useLazyLoad = () => {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-8')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return ref
}

const LazySection = ({ children }) => {
  const ref = useLazyLoad()
  return (
    <div ref={ref} className="opacity-0 translate-y-8 transition-all duration-700 ease-out">
      {children}
    </div>
  )
}

const useTypewriter = (phrases, typingSpeed = 80, deletingSpeed = 50, pauseTime = 1800) => {
  const [displayed, setDisplayed] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPausing, setIsPausing] = useState(false)

  useEffect(() => {
    if (isPausing) return
    const current = phrases[phraseIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const next = current.slice(0, displayed.length + 1)
        setDisplayed(next)
        if (next === current) {
          setIsPausing(true)
          setTimeout(() => { setIsPausing(false); setIsDeleting(true) }, pauseTime)
        }
      } else {
        const next = current.slice(0, displayed.length - 1)
        setDisplayed(next)
        if (next === '') {
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)
    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, isPausing, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime])

  return displayed
}

const App = () => {
  const typed = useTypewriter(['that matter.', 'that solves problems.'])

  const [formData, setFormData] = useState({ email: "", subject: "", message: "" })
  const [loading, setloading] = useState(false)
  const [success, setsuccess] = useState("")
  const [pageerror, setpageerror] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handlesubmit = async () => {
    setloading(true)
    setsuccess("")
    setpageerror("")
    await fetch('http://localhost:8001/api/sendemail', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setsuccess("Message sent successfully!")
          setFormData({ email: "", subject: "", message: "" })
          setloading(false)
          return
        }
      })
      .catch((error) => {
        setpageerror("An error occurred while sending your message. Please try again later.")
        setloading(false)
      })
}

return (
  <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', backgroundColor: '#0B0B0D', color: '#E8E8EC', fontFamily: 'monospace' }}>

    {/* ── NAVBAR ── */}
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-[#0F0F12] border-b border-[#1E1E26]">
      <h3 className="text-white font-extrabold text-xl tracking-tight">
        AY<span className="text-[#C8F564]">O</span><span className="text-[#C8F564]">.</span>
      </h3>
    </nav>

    {/* ── HERO ── */}
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-20">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-6 h-[2px] bg-[#C8F564] shrink-0"></span>
        <span className="text-[#C8F564] text-[9px] sm:text-xs uppercase tracking-widest font-bold">Fullstack Developer · Lagos, NG</span>
      </div>

      <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
        Building things
      </h1>
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-[#C8F564] leading-tight tracking-tight whitespace-nowrap">
        {typed}<span className="inline-block w-[3px] h-[0.8em] bg-[#C8F564] ml-1 align-middle animate-pulse"></span>
      </h1>

      <p className="text-[#6B6B78] text-base md:text-lg leading-relaxed mt-8" style={{ maxWidth: '420px' }}>
        I'm Adebanjo Ayomide, a fullstack developer with over 2 years of experience.
        I have a passion for building products for real people.
      </p>

      <div className="flex items-center gap-2 mt-6 w-fit px-4 py-2" style={{ backgroundColor: '#1A2A0A' }}>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4ADE80]"></span>
        </span>
        <span className="text-[#4ADE80] text-xs font-semibold">Available for work</span>
      </div>

      <div className="flex flex-wrap gap-4 mt-8">
        <a href="#contact">
          <button className="bg-[#C8F564] text-[#0B0B0D] font-bold text-sm uppercase tracking-wider px-8 py-4 hover:-translate-y-0.5 transition-all duration-200" >
            Hire Me
          </button>
        </a>

        <a href="public/Adebanjo Ayomide CV 2.pdf" target="_blank" rel="noopener noreferrer">
          <button className="border border-[#1E1E26] text-white font-semibold text-sm uppercase tracking-wider px-8 py-4 hover:border-[#C8F564] hover:text-[#C8F564] transition-all duration-200">
            View Resume
          </button>
        </a>
      </div>
    </section>

    {/* ── MARQUEE ── */}
    <div className="border-t border-b border-[#1E1E26] bg-[#131316] py-4" style={{ overflow: 'hidden' }}>
      <div className="flex gap-12 animate-[marquee_18s_linear_infinite]" style={{ width: 'max-content' }}>
        {['React.js', '✦', 'Node.js', '✦', 'Express', '✦', 'MongoDB', '✦', 'Javascript', '✦', 'Tailwindcss', '✦', 'Firebase', '✦',
          'React.js', '✦', 'Node.js', '✦', 'Express', '✦', 'MongoDB', '✦', 'Javascript', '✦', 'Tailwindcss', '✦', 'Firebase'].map((s, i) => (
            <p key={i} className={`text-xs uppercase tracking-widest font-bold whitespace-nowrap ${s === '✦' ? 'text-[#C8F564]' : 'text-[#6B6B78]'}`}>
              {s}
            </p>
          ))}
      </div>
    </div>

    {/* ── ABOUT ── */}
    <section id="about" className="border-t border-[#1E1E26] px-6 md:px-12 py-24">
      <LazySection>
        <div className="flex items-center gap-3 mb-12">
          <span className="w-1 h-10 bg-[#C8F564] shrink-0"></span>
          <span className="text-[#C8F564] text-xs uppercase tracking-widest font-bold">About Me</span>
        </div>

        {/* single col on mobile, two cols on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12" style={{ minWidth: 0 }}>

          {/* left — image */}
          <div className="rounded-sm relative flex items-center justify-center overflow-hidden  w-full md:w-80 mx-auto">
            <img src="/Ayo.png" alt="Ayomide" loading="lazy" className="w-full h-full object-contain" />
          </div>

          {/* right — text + stats, constrained to its column */}
          <div className="min-w-0">
            <p className="text-[#6B6B78] text-base leading-loose break-words">
              I'm a fullstack developer based in Lagos, Nigeria. I have a passion for building scalable and efficient web applications.
              I have a background in fullstack development from SQI College of ICT. I love building products that solve real problems,
              especially in the African market where the gap between problems and digital solutions is wide open.
            </p>

            <div className="grid grid-cols-2 gap-px mt-10 bg-[#1E1E26] border border-[#1E1E26]">
              {[
                { num: '2+', label: 'Years Building' },
                { num: '3+', label: 'Projects Shipped' },
                { num: '1', label: 'Startup in Progress' },
                { num: '🇳🇬', label: 'Lagos, Nigeria' },
              ].map(({ num, label }) => (
                <div key={label} className="bg-[#131316] px-6 py-6">
                  <p className="text-3xl font-extrabold text-[#C8F564] tracking-tight">{num}</p>
                  <p className="text-[#6B6B78] text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LazySection>
    </section>

    {/* ── TECH STACK ── */}
    <section id="stack" className="border-t border-[#1E1E26] px-6 md:px-12 py-24">
      <LazySection>
        <div className="flex items-center gap-3 mb-10">
          <span className="w-1 h-10 bg-[#C8F564] shrink-0"></span>
          <span className="text-[#C8F564] text-xs uppercase tracking-widest font-bold">Tech Stack</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-px bg-[#1E1E26] border border-[#1E1E26]">
          {['React.js', 'Node.js', 'JavaScript', 'Firebase', 'MongoDB', 'Express', 'PostgreSQL', 'Tailwind CSS', 'REST APIs', 'Git & Github'].map((sk, i) => (
            <div
              key={sk}
              className={`px-3 py-3 text-center text-xs font-semibold tracking-wide transition-all duration-200 cursor-default truncate
                  ${[].includes(i)
                  ? 'bg-[#C8F564] text-[#0B0B0D]'
                  : 'bg-[#131316] text-[#6B6B78] hover:bg-[#C8F564] hover:text-[#0B0B0D]'
                }`}
            >
              {sk}
            </div>
          ))}
        </div>
      </LazySection>
    </section>

    {/* ── PROJECTS ── */}
    <section id="projects" className="border-t border-[#1E1E26] px-6 md:px-12 py-24">
      <LazySection>
        <div className="flex items-center gap-3 mb-10">
          <span className="w-1 h-10 bg-[#C8F564] shrink-0"></span>
          <span className="text-[#C8F564] text-xs uppercase tracking-widest font-bold">Selected Work</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-[#131316] border border-[#1E1E26] rounded-2xl overflow-hidden hover:border-[#C8F564] transition-all duration-300 group">
            <div className="flex items-center justify-center w-full aspect-video bg-[#0F0F12] overflow-hidden">
              <span className="text-[#C8F564] text-sm font-bold text-center tracking-widest uppercase px-4 py-2">
                Coming Soon
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-white font-bold text-base leading-snug">Event Ticketing & Venue Platform</h3>
                <button className="bg-[#C8F564] text-[#0B0B0D] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 whitespace-nowrap shrink-0">
                  In Progress
                </button>
              </div>
              <p className="text-[#6B6B78] text-sm leading-relaxed mb-4">A fullstack application for managing event ticketing and venue bookings.</p>
              <p className="text-[#C8F564] text-[11px] font-bold tracking-widest uppercase">React · Node.js · Express · MongoDB</p>
            </div>
          </div>

          <div className="bg-[#131316] border border-[#1E1E26] rounded-2xl overflow-hidden hover:border-[#C8F564] transition-all duration-300 group">
            <div className="w-full aspect-video bg-[#0F0F12] overflow-hidden relative">
              <img src="/cinema.png" alt="CinemaAccess" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">

                {/* GitHub */}
                <a href="https://github.com/Ayowiththevibe/cinemaaccess" target="_blank" rel="noopener noreferrer"
                  className="bg-[#0B0B0D] border border-[#C8F564] text-[#C8F564] p-3 rounded-full hover:bg-[#C8F564] hover:text-[#0B0B0D] transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                  </svg>
                </a>

                {/* Live Preview */}
                <a href="https://cinemaaccess-6710a.web.app/" target="_blank" rel="noopener noreferrer"
                  className="bg-[#0B0B0D] border border-[#C8F564] text-[#C8F564] p-3 rounded-full hover:bg-[#C8F564] hover:text-[#0B0B0D] transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </a>

              </div>
            </div>

            <div className="p-5">
              <h3 className="text-white font-bold text-base leading-snug mb-3">CinemaAccess</h3>
              <p className="text-[#6B6B78] text-sm leading-relaxed mb-4">A cinema ticketing web app. Users browse movies, select seats and purchase tickets online. Seamless payments via Paystack.</p>
              <p className="text-[#C8F564] text-[11px] font-bold tracking-widest uppercase">JavaScript · Firebase · Email.js · Paystack</p>
            </div>
          </div>

        </div>
      </LazySection>
    </section>

    {/* ── CONTACT ── */}
    <section id="contact" className="border-t border-[#1E1E26] px-6 md:px-12 py-24">
      <LazySection>
        <div className="flex items-center gap-3 mb-12">
          <span className="w-1 h-10 bg-[#C8F564] shrink-0"></span>
          <span className="text-[#C8F564] text-xs uppercase tracking-widest font-bold">Get In Touch</span>
        </div>

        <div className="flex flex-col md:flex-row gap-16 items-start">

          {/* left — heading + sub */}
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">Let's build</h1>
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#C8F564] tracking-tight leading-tight mb-6">something.</h1>
            <p className="text-[#6B6B78] text-base leading-relaxed">
              Open to freelance opportunities, discussing new projects & collaborations.
            </p>
            <div className="flex items-center gap-8 mt-10">
              <a href="https://github.com/Ayowiththevibe" className="text-[#6B6B78] hover:text-[#C8F564] text-xs uppercase tracking-widest transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/adebanjo-ayomide-718b87281" className="text-[#6B6B78] hover:text-[#C8F564] text-xs uppercase tracking-widest transition-colors">LinkedIn</a>
              <a href="https://x.com/ayo_mideyy?s=21" className="text-[#6B6B78] hover:text-[#C8F564] text-xs uppercase tracking-widest transition-colors">Twitter</a>
            </div>
          </div>

          {/* right — form */}
          <div className="md:w-1/2 w-full flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[#6B6B78] text-xs uppercase tracking-widest">Your Email</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="your@email.com"
                className="bg-[#131316] border border-[#1E1E26] text-white text-sm px-4 py-3 w-full focus:outline-none focus:border-[#C8F564] transition-colors placeholder:text-[#2E2E38]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-[#6B6B78] text-xs uppercase tracking-widest">Subject</label>
              <input type="text" id="subject" value={formData.subject} onChange={handleChange} placeholder="Subject of your mail"
                className="bg-[#131316] border border-[#1E1E26] text-white text-sm px-4 py-3 w-full focus:outline-none focus:border-[#C8F564] transition-colors placeholder:text-[#2E2E38]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-[#6B6B78] text-xs uppercase tracking-widest">Message</label>
              <textarea id="message" value={formData.message} onChange={handleChange} placeholder="Your message here..."
                className="bg-[#131316] border border-[#1E1E26] text-white text-sm px-4 py-3 h-28 w-full focus:outline-none focus:border-[#C8F564] transition-colors placeholder:text-[#2E2E38] resize-none" />
            </div>
            <button onClick={handlesubmit} className="bg-[#C8F564] text-[#0B0B0D] font-bold text-sm uppercase tracking-wider px-8 py-4 w-full hover:-translate-y-0.5 transition-all duration-200">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
            {pageerror && <p className="text-red-500 text-sm mt-2">{pageerror}</p>}
          </div>

        </div>
      </LazySection>
    </section>

    {/* ── FOOTER ── */}
    <footer className="border-t border-[#1E1E26] bg-[#0F0F12] px-6 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
      <h3 className="text-white font-extrabold text-lg">
        AY<span className="text-[#C8F564]">O</span><span className="text-[#C8F564]">.</span>
      </h3>
      <p className="text-[#6B6B78] text-xs">&copy; 2026 Ayo. All rights reserved.</p>
    </footer>

    <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

  </div>
)
}

export default App