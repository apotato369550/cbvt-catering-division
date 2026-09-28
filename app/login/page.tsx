"use client";
import Link from "next/link";
import { useState } from "react";
export default function Login() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("Demo mode: use any email and password to continue.");
  }
  return (
    <main className="grid min-h-screen place-items-center bg-primary px-6 text-primary-foreground">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-10 flex items-center gap-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cbvt_kitchen_logo-otM83wldTRWyZ3X6ToyH1nQWSYsn9j.png"
            alt="CBVT Kitchen logo"
            className="size-12 rounded-full bg-card"
          />
          <span className="font-serif text-xl font-bold">CBVT Kitchen</span>
        </Link>
        <div className="rounded-2xl bg-card p-8 text-card-foreground shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Welcome back
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold">
            Sign in to your kitchen.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your daily operations, organized in one place.
          </p>
          <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
            <label className="text-sm font-medium">
              Email
              <input
                type="email"
                required
                placeholder="you@cbvtkitchen.com"
                className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3"
              />
            </label>
            <label className="text-sm font-medium">
              Password
              <div className="mt-2 flex rounded-lg border border-border">
                <input
                  required
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  className="min-w-0 flex-1 bg-card px-3 py-3 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="px-3 text-xs text-muted-foreground"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
              <Link href="/" className="ml-auto text-accent-foreground">
                Forgot password?
              </Link>
            </div>
            {error && (
              <p className="rounded-lg bg-accent/15 p-3 text-sm text-accent-foreground">
                {error}
              </p>
            )}
            <button className="rounded-lg bg-accent py-3 font-bold text-accent-foreground">
              Sign in to demo
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-primary-foreground/55">
          UI preview only · No account required
        </p>
      </div>
    </main>
  );
}
