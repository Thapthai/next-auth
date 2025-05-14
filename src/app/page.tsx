import LogingButton from "@/components/auth/login-button";
import Image from "next/image";

export const Home = () => {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Hello World
      สวัสดี

      <LogingButton>
        <button>Sign In</button>
      </LogingButton>
    </div>
  );
}

export default Home;