import { motion } from "framer-motion";

const Creators = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-5xl w-full mx-auto font-mono text-xl sm:text-2xl md:text-3xl whitespace-pre-line leading-relaxed tracking-wider ">
        <motion.h2
          className="text-3xl md:text-4xl font-light text-center mb-12 "
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          Creators of the Soul
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "zClut",
              github: "https://github.com/zclut",
              image: "https://avatars.githubusercontent.com/u/58002673?v=4",
            },
            {
              name: "Klasinky",
              github: "https://github.com/klasinky",
              image: "https://avatars.githubusercontent.com/u/58831952?v=4",
            },
          ].map((creator, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center p-6 rounded-[0.5rem] border border-purple-500/20 bg-purple-900/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-[0_0_15px_rgba(149,76,233,0.5)]">
                <img
                  src={creator.image || "/placeholder.svg"}
                  alt={creator.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
              </div>
              <h3 className="text-xl font-medium mb-1 text-purple-100">
                {creator.name}
              </h3>
              <a
                href={creator.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-900/30 border border-purple-500/30 hover:bg-purple-800/40 transition-colors duration-300 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                GitHub
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Creators;
