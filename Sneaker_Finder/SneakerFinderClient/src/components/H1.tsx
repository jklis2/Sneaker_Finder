import { ReactChild } from "react";

type H1Props = {
  children: ReactChild;
  className?: string;
};

export default function H1({ children, className = "" }: H1Props) {
  return (
    <h1 className={`text-3xl font-bold mt-10 mb-6 ${className}`}>{children}</h1>
  );
}
