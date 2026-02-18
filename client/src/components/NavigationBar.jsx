import { Users, CirclePlus, House, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
          w-[300px] h-[75px]
          px-6 py-3
          flex justify-around items-center
          rounded-full
          bg-white/20
          backdrop-blur-xl
          border border-white/30
          shadow-lg shadow-black/20
          ring-1 ring-white/20
        "
      >
        {/* Left: Home */}
        <Link
          to={"/"}
          className="
            text-2xl text-gray-400 drop-shadow-sm
            transition duration-300
            hover:text-pink-400 hover:drop-shadow-[0_0_10px_rgba(255,0,150,0.8)]
            active:animate-ping
          "
        >
          <House size={34} />
        </Link>

        {/* Center: Plus */}
        <Link
          to={"/addCustomer"}
          className="
            text-3xl text-gray-400
            transition duration-300
            hover:text-pink-400 hover:drop-shadow-[0_0_15px_rgba(255,0,150,0.9)]
            active:animate-ping
          "
        >
          <CirclePlus size={34} />
        </Link>

        {/* Right: Customers */}
        <Link
          to={"/allUtang"}
          className="
            text-2xl text-gray-400 drop-shadow-sm
            transition duration-300
            hover:text-pink-400 hover:drop-shadow-[0_0_10px_rgba(255,0,150,0.8)]
            active:animate-ping
          "
        >
          <Users size={34} />
        </Link>

        <Link
          to={"/settings"}
          className="
            text-2xl text-gray-400 drop-shadow-sm
            transition duration-300
            hover:text-pink-400 hover:drop-shadow-[0_0_10px_rgba(255,0,150,0.8)]
            active:animate-ping
          "
        >
          <Settings size={34} />
        </Link>
      </div>
    </nav>
  );
};

export default NavigationBar;
