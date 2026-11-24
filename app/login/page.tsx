import { LoginBrand } from "@/components/auth/login-brand";
import { LoginForm } from "@/components/auth/login-form";

export default function Login() {
  return (
    <main className="grid min-h-screen place-items-center bg-primary px-6 text-primary-foreground">
      <div className="w-full max-w-md">
        <LoginBrand />

        <LoginForm />

        <p className="mt-6 text-center text-xs text-primary-foreground/55">
          UI preview only · No account required
        </p>
      </div>
    </main>
  );
}
