import { motion } from "framer-motion";

const Timelapse = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-5xl w-full mx-auto font-mono text-xl sm:text-2xl md:text-3xl whitespace-pre-line leading-relaxed tracking-wider ">
        <motion.h2
          className="text-3xl md:text-4xl font-light text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          The Soul Remembers
        </motion.h2>

        <motion.div
          className="relative aspect-video w-full overflow-hidden rounded-[0.5rem]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
            <div className="absolute inset-0 w-full h-full rounded-[0.5rem] overflow-hidden">
                <video
                className="w-full h-full object-fill"
                src="https://soulpixel.klasinky.com/timelapse/timelapse.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                />
            </div>
        </motion.div>

        <motion.p
          className="mt-6 text-center text-sm text-purple-100/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
        >
          Watch as countless souls leave their mark, creating something greater
          than themselves.
        </motion.p>
      </div>
    </section>
  );
};

export default Timelapse;
