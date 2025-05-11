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
      trailPoints: { x: number; y: number; size: number; alpha: number }[]
      clusterId: number | null
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
        this.trailPoints = []
        this.clusterId = Math.random() < 0.7 ? Math.floor(Math.random() * 5) : null
      }

      update(time: number) {
        // Store current position in trail
        if (this.trailPoints.length > 10) {
          this.trailPoints.pop()
        }

        this.trailPoints.unshift({
          x: this.x,
          y: this.y,
          size: this.size,
          alpha: this.alpha,
        })

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

        // Draw trail
        if (this.trailPoints.length > 1) {
          ctx.beginPath()
          ctx.moveTo(this.trailPoints[0].x, this.trailPoints[0].y)

          for (let i = 1; i < this.trailPoints.length; i++) {
            const point = this.trailPoints[i]
            const prevPoint = this.trailPoints[i - 1]

            // Create a curved line
            const cpX = (prevPoint.x + point.x) / 2
            const cpY = (prevPoint.y + point.y) / 2

            ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpX, cpY)

            // Fade out the trail
            const alpha = 0.2 * (1 - i / this.trailPoints.length)
            ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${alpha})`
            ctx.lineWidth = point.size * 0.8
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(cpX, cpY)
          }
        }
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

    const drawSoulConnections = () => {
      // For each cluster, connect particles that belong to it
      soulClusters.forEach((cluster) => {
        const clusterParticles = particles.filter((p) => p.clusterId === cluster.id)

        if (clusterParticles.length > 1) {
          // Create a path connecting particles in this cluster
          ctx.beginPath()

          // Start from a random particle
          const startIdx = Math.floor(Math.random() * clusterParticles.length)
          ctx.moveTo(clusterParticles[startIdx].x, clusterParticles[startIdx].y)

          // Connect to other particles with curved lines
          for (let i = 0; i < clusterParticles.length; i++) {
            if (i !== startIdx) {
              const p = clusterParticles[i]
              const prevP = i === 0 ? clusterParticles[startIdx] : clusterParticles[i - 1]

              // Control points for curve
              const cpX1 = prevP.x + (p.x - prevP.x) * 0.3 + Math.sin(time * 0.01) * 20
              const cpY1 = prevP.y + (p.y - prevP.y) * 0.7 + Math.cos(time * 0.01) * 20
              const cpX2 = prevP.x + (p.x - prevP.x) * 0.7 + Math.sin(time * 0.01 + 1) * 20
              const cpY2 = prevP.y + (p.y - prevP.y) * 0.3 + Math.cos(time * 0.01 + 1) * 20

              // Draw bezier curve
              ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, p.x, p.y)
            }
          }

          // Close the path back to the start
          const firstP = clusterParticles[startIdx]
          const lastP = clusterParticles[clusterParticles.length - 1]
          const cpX1 = lastP.x + (firstP.x - lastP.x) * 0.3 + Math.sin(time * 0.01 + 2) * 20
          const cpY1 = lastP.y + (firstP.y - lastP.y) * 0.7 + Math.cos(time * 0.01 + 2) * 20
          const cpX2 = lastP.x + (firstP.x - lastP.x) * 0.7 + Math.sin(time * 0.01 + 3) * 20
          const cpY2 = lastP.y + (firstP.y - lastP.y) * 0.3 + Math.cos(time * 0.01 + 3) * 20
          ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, firstP.x, firstP.y)

          // Style and stroke
          ctx.strokeStyle = `hsla(${cluster.hue}, 70%, 50%, 0.05)`
          ctx.lineWidth = 2
          ctx.stroke()

          // Fill with gradient
          const gradient = ctx.createLinearGradient(
            cluster.x - cluster.radius,
            cluster.y - cluster.radius,
            cluster.x + cluster.radius,
            cluster.y + cluster.radius,
          )
          gradient.addColorStop(0, `hsla(${cluster.hue}, 70%, 40%, 0.02)`)
          gradient.addColorStop(1, `hsla(${cluster.hue}, 70%, 30%, 0.01)`)
          ctx.fillStyle = gradient
          ctx.fill()
        }
      })
    }

    const drawSoulWisps = () => {
      // Draw ethereal wisps connecting some particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]

        // Only create wisps for some particles
        if (Math.random() > 0.97) {
          // Find nearby particles
          for (let j = 0; j < particles.length; j++) {
            if (i !== j) {
              const p2 = particles[j]
              const dx = p1.x - p2.x
              const dy = p1.y - p2.y
              const distance = Math.sqrt(dx * dx + dy * dy)

              if (distance < 150) {
                // Create a wisp between these particles
                const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
                gradient.addColorStop(0, `hsla(${p1.hue}, ${p1.saturation}%, ${p1.lightness}%, 0.1)`)
                gradient.addColorStop(1, `hsla(${p2.hue}, ${p2.saturation}%, ${p2.lightness}%, 0.1)`)

                ctx.strokeStyle = gradient
                ctx.lineWidth = 1

                // Draw a curved path
                ctx.beginPath()
                ctx.moveTo(p1.x, p1.y)

                // Control points for the curve
                const midX = (p1.x + p2.x) / 2
                const midY = (p1.y + p2.y) / 2
                const offset = 30 * Math.sin(time * 0.001 + i)

                ctx.quadraticCurveTo(midX + offset, midY + offset, p2.x, p2.y)

                ctx.stroke()
              }
            }
          }
        }
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

      // Draw soul connections
      drawSoulConnections()

      // Update and draw particles
      for (const particle of particles) {
        particle.update(time)
        particle.draw(ctx)
      }

      // Draw ethereal wisps
      drawSoulWisps()

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
