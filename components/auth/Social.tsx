"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };
  return (
    <div className="flex flex-col gap-y-2 w-full" >
      <h3 className="text-md w-full text-center text-zinc-500">Or</h3>
      <div className="flex justify-center w-full gap-x-2">
        <Button
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => onClick("google")}
        >
          <FcGoogle className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => {
            onClick("github");
          }}
        >
          <FaGithub className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
