import { SignedIn, UserButton } from "@clerk/astro/react";
import { Copyright, Info } from "lucide-react";
import OnlineUsers from "@/components/react/OnlineUsers";

interface Props {
  user: any;
}

const Profile = ({ user }: Props) => {
  const profile = [
    { id: 1, name: "SOUL", value: user.username },
    { id: 2, name: "LEVEL", value: "INITIATE" },
    { id: 3, name: "PIXELS", value: "12,458" },
  ];

  return (
    <div className="border border-purple-900/50 bg-black/80 rounded-sm overflow-hidden">
      <div className="p-2 border-b border-purple-900/50 flex justify-between items-center">
        <div className="text-sm tracking-wider flex items-center gap-2">
          <Info className="h-4 w-4" />
          PROFILE
        </div>
      </div>
      <div className="p-2">
        <div className="flex flex-row gap-2 mb-2">
          <div className="flex flex-col items-center justify-center mb-2">
            <SignedIn>
              <div className="w-[4rem] h-[4rem] rounded-full overflow-hidden">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: "4rem",
                        height: "4rem",
                        border: "3px solid #8B5BE8",
                      },
                    },
                  }}
                />
              </div>
            </SignedIn>
            {/* <span className="text-lg font-bold text-center">{user.username}</span> */}
          </div>
          <div className="flex flex-wrap justify-between text-sm w-full">
            {profile.map(({ id, name, value }) => (
              <div key={id} className={`flex w-1/2 items-center gap-1`}>
                <span className="text-purple-500">{name}:</span>
                <span className="text-fuchsia-500 truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="inline-flex items-center gap-1 my-auto">
            <Copyright size={12} />
            <span>SOULPIXEL</span>
          </span>
          <OnlineUsers />
        </div>
      </div>
    </div>
  );
};

export default Profile;
