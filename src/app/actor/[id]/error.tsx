"use client";
import { useEffect } from "react";

export default function ActorError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="wrapper flex-col-center gap-4 text-center min-h-[50vh] justify-center">
      <h1 className="text-[125%]">We couldn't load this actor's details</h1>
      <p className="text-content-secondary">Please check your connection and try again</p>
      <button type="button" className="btn-primary mt-2" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
