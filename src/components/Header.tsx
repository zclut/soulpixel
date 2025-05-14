import { SignedIn, UserButton } from "@clerk/astro/react";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex justify-center items-center bg-gray-900/60 z-10">
      <SignedIn>
        <UserButton showName={true} />
      </SignedIn>
    </header>
  );
};

export default Header;
