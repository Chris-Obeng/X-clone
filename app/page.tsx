export const dynamic = "force-dynamic";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { headers } from "next/headers";
import { Grok, Apple, Google } from "@lobehub/icons";
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";


const Page = async () => {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent);


  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      {/* right side */}
      <div className="flex w-[50%]  lg:justify-center lg:items-center">
        <FontAwesomeIcon
          icon={faXTwitter}
          className="text-[20rem] text-white"
        />
      </div>
      {/* left side */}
      <div className="flex flex-col w-[50%] justify-center items-start px-10 mt-10">
        <h1 className="text-3xl sm:text-6xl font-extrabold mb-12 font-stretch-75 ">
          Happening now
        </h1>
        <h2 className="text-3xl font-bold font-stretch-expanded mb-7">
          Join today.
        </h2>

        <SignInButton mode="modal">
          <Button className="text-center bg-white text-black p-5 mb-4 text-sm w-75 font-semibold rounded-full cursor-pointer">
            <Google.Color className="size-5" />
            Sign in with Google
          </Button>
        </SignInButton>
        <SignInButton mode="modal">
          <Button className="text-center bg-white text-black p-5 text-sm w-75 font-semibold rounded-full cursor-pointer">
            <Apple className="size-5" />
            Sign in with Apple
          </Button>
        </SignInButton>

        {/* shadcn seperator */}

        <div className="flex w-75 items-center gap-3 my-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
          <Separator className="flex-1 bg-white/20" />
          <span className="px-1">or</span>
          <Separator className="flex-1 bg-white/20" />
        </div>

        <SignUpButton mode="modal">
          <Button className="text-center bg-white text-black p-5 text-sm w-75 font-bold rounded-full mb-4 cursor-pointer">
            Create account
          </Button>
        </SignUpButton>

        <p className="text-[12px] text-gray-400 font-extralight mb-4">
          By signing up, you agree to the{" "}
          <span className="text-sky-600 hover:underline cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-sky-600 hover:underline cursor-pointer">
            Privacy <br />
            Policy
          </span>
          , including{" "}
          <span className="text-sky-600 hover:underline cursor-pointer">
            Cookie Use
          </span>
          .
        </p>

        <div>
          <p className="mb-4 font-semibold mt-6">Already have an account?</p>

          <SignInButton mode="modal">
            <Button className="text-center bg-white text-black p-5 text-sm w-75 font-semibold rounded-full cursor-pointer">
              Sign in
            </Button>
          </SignInButton>
        </div>

        {isMobile ? (
          <Button className="text-center bg-black text-white p-5 mt-4 border-gray-400 border text-sm w-75 font-normal rounded-full cursor-pointer">
            <FontAwesomeIcon icon={faXTwitter} className=" text-white size-5" />
            Get app
          </Button>
        ) : (
          <Button className="text-center bg-black text-white p-5 mt-4 border-gray-400 border text-sm w-75 font-normal rounded-full cursor-pointer">
            <Grok className="size-5" />
            Get Grok
          </Button>
        )}
      </div>
    </div>
  );
};

export default Page;
