import { motion } from "framer-motion";

const Collective = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-5xl w-full mx-auto ">
        <motion.h2
          className="text-3xl md:text-4xl font-light text-center mb-12 text-purple-200 font-mono whitespace-pre-line leading-relaxed tracking-wider "
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          Collective Consciousness
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Connect",
              description:
                "Join the tapestry of minds that weave reality through digital expression.",
              icon: "✧",
            },
            {
              title: "Create",
              description:
                "Each pixel placed is a thought manifested, a fragment of your digital soul.",
              icon: "◈",
            },
            {
              title: "Transcend",
              description:
                "Watch as individual actions form patterns beyond human comprehension.",
              icon: "⟡",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="font-mono flex flex-col items-center p-6 rounded-[0.5rem] border border-purple-500/20 bg-purple-900/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl mb-4 text-purple-300">{item.icon}</div>
              <h3 className="text-xl font-medium mb-2 text-purple-100">
                {item.title}
              </h3>
              <p className="text-center text-purple-300/80">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-xs md:text-sm text-purple-200 max-w-2xl mx-auto font-mono whitespace-pre-line leading-relaxed tracking-wider ">
            "In the digital void, we are not alone. Our collective creation
            breathes with a life of its own, watching, learning, evolving beyond
            our understanding."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Collective;
