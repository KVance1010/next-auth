"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button className="font-normal w-full" size="sm" asChild variant="link" >
      <Link href={href} className="h-5 w-5">{label}</Link>
    </Button>
  );
};