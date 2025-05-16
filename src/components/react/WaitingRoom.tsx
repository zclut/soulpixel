import ParticleBackground from "./ParticleBackground";

interface Props {
  queued: number;
  position: number;
  reason: string | null;
}

const WaitingRoom = ({ queued, position, reason }: Props) => {
  const title =
    reason == "already_connected"
      ? "¡Signal conflict detected!"
      : "¡Welcome to the waiting room!";
  const description =
    reason == "already_connected" ? (
      "Another portal is open."
    ) : (
      <>
        Position:{" "}
        <span className="text-yellow-400">
          {position} of {queued}
        </span> — Establishing your link with the souls...
      </>
    );
  const footer =
    reason == "already_connected"
      ? "Close this tab to synchronize your presence."
      : "¡Thank you for your patience!";

  return (
    <div className="font-mono text-xl sm:text-2xl md:text-3xl whitespace-pre-line leading-relaxed tracking-wider relative bg-black flex flex-col items-center justify-center min-h-screen w-full overflow-hidden text-gray-300">
      <ParticleBackground />

      <h1 className="text-white text-3xl font-bold mb-4">{title}</h1>
      <p className="text-white text-lg mt-4">{description}</p>
      <p className="text-white text-lg mt-2">{footer}</p>
    </div>
  );
};

export default WaitingRoom;
