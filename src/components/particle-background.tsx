"use client"

import { useEffect, useRef } from "react"

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Make sure we're in the browser environment
    if (typeof window === "undefined") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: SoulParticle[] = []
    let soulClusters: SoulCluster[] = []
    let mouseX = 0
    let mouseY = 0
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    class SoulParticle {
      x: number
      y: number
      size: number
      baseSize: number
      speedX: number
      speedY: number
      color: string
      angle: number
      angleSpeed: number
      pulseSpeed: number
      pulseFactor: number
      hue: number
      saturation: number
      lightness: number
      alpha: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.baseSize = Math.random() * 2 + 0.5
        this.size = this.baseSize
        this.speedX = Math.random() * 0.4 - 0.2
        this.speedY = Math.random() * 0.4 - 0.2
        this.hue = Math.floor(Math.random() * 60) + 250 // Purple hues
        this.saturation = Math.floor(Math.random() * 70) + 30
        this.lightness = Math.floor(Math.random() * 30) + 40
        this.alpha = Math.random() * 0.5 + 0.3
        this.color = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`
        this.angle = Math.random() * Math.PI * 2
        this.angleSpeed = Math.random() * 0.004 - 0.002
        this.pulseSpeed = Math.random() * 0.02 + 0.01
        this.pulseFactor = Math.random() * Math.PI * 2
      }

      update(time: number) {
        // Update angle for circular motion
        this.angle += this.angleSpeed

        // Add some noise to movement based on time
        const noiseX = Math.sin(this.x * 0.01 + time * 0.001) * 0.3
        const noiseY = Math.cos(this.y * 0.01 + time * 0.001) * 0.3

        // Update position with circular motion component
        this.x += this.speedX + Math.sin(this.angle) * 0.5 + noiseX
        this.y += this.speedY + Math.cos(this.angle) * 0.5 + noiseY

        // Pulse size
        this.pulseFactor += this.pulseSpeed
        this.size = this.baseSize + Math.sin(this.pulseFactor) * (this.baseSize * 0.5)

        // Wrap around screen edges
        if (this.x > canvas.width + 50) this.x = -50
        else if (this.x < -50) this.x = canvas.width + 50
        if (this.y > canvas.height + 50) this.y = -50
        else if (this.y < -50) this.y = canvas.height + 50

        // Slightly shift color over time
        this.hue += 0.05
        if (this.hue > 310) this.hue = 250
        this.color = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw the main particle
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4)
        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.3)`)
        gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    class SoulCluster {
      x: number
      y: number
      radius: number
      id: number
      hue: number
      pulseSpeed: number
      pulseFactor: number
      angle: number
      speed: number

      constructor(id: number) {
        this.id = id
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = Math.random() * 100 + 50
        this.hue = Math.floor(Math.random() * 60) + 250
        this.pulseSpeed = Math.random() * 0.01 + 0.005
        this.pulseFactor = Math.random() * Math.PI * 2
        this.angle = Math.random() * Math.PI * 2
        this.speed = Math.random() * 0.2 + 0.1
      }

      update() {
        // Move in a large circular pattern
        this.angle += 0.001
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        // Wrap around screen edges with buffer
        const buffer = this.radius
        if (this.x > canvas.width + buffer) this.x = -buffer
        else if (this.x < -buffer) this.x = canvas.width + buffer
        if (this.y > canvas.height + buffer) this.y = -buffer
        else if (this.y < -buffer) this.y = canvas.height + buffer

        // Pulse the radius
        this.pulseFactor += this.pulseSpeed
      }

      draw(ctx: CanvasRenderingContext2D) {
        const pulseRadius = this.radius * (1 + Math.sin(this.pulseFactor) * 0.2)

        // Draw subtle glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, pulseRadius)
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 50%, 0.05)`)
        gradient.addColorStop(0.5, `hsla(${this.hue}, 70%, 40%, 0.03)`)
        gradient.addColorStop(1, `hsla(${this.hue}, 70%, 30%, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const initParticles = () => {
      particles = []
      soulClusters = []

      // Create soul clusters
      for (let i = 0; i < 5; i++) {
        soulClusters.push(new SoulCluster(i))
      }

      // Create particles
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 150)
      for (let i = 0; i < particleCount; i++) {
        particles.push(new SoulParticle())
      }
    }

    const animate = () => {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw soul clusters
      soulClusters.forEach((cluster) => {
        cluster.update()
        cluster.draw(ctx)
      })

      // Update and draw particles
      for (const particle of particles) {
        particle.update(time)
        particle.draw(ctx)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // Track mouse position for potential interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ filter: "blur(1px)" }} />
}
