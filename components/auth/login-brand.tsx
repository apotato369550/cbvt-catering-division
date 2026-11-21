
import Link from "next/link";

export function LoginBrand() {
  return (
    <Link href="/" className="mb-10 flex items-center gap-3">
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cbvt_kitchen_logo-otM83wldTRWyZ3X6ToyH1nQWSYsn9j.png"
        alt="CBVT Kitchen logo"
        className="size-12 rounded-full bg-card"
      />

      <span className="font-serif text-xl font-bold">
        CBVT Kitchen
      </span>
    </Link>
  );
}
