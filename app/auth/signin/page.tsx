"use client";

import { getProviders, signIn, type ClientSafeProvider } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Github, Mail, Loader2, LogIn } from "lucide-react";
import { useEffect, useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    getProviders().then((nextProviders) => {
      setProviders(nextProviders);
    });
  }, []);

  const providerButtons = useMemo(() => {
    if (!providers) {
      return [];
    }

    return Object.values(providers).filter((provider) => provider.id !== "credentials");
  }, [providers]);

  const handleSignIn = (provider: string) => {
    setIsLoading(provider);
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white">SagarFlix</h1>
          <p className="mt-3 text-white/60">Sign in to access your career OS</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-panel p-8">
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error === "Configuration" ? "Authentication not configured. Check environment variables." : "Sign in failed. Please try again."}
            </div>
          )}

          <div className="space-y-4">
            {providerButtons.length > 0 ? (
              providerButtons.map((provider) => {
                const isGithub = provider.id === "github";
                const isGoogle = provider.id === "google";
                const Icon = isGithub ? Github : isGoogle ? Mail : LogIn;

                return (
                  <button
                    key={provider.id}
                    onClick={() => handleSignIn(provider.id)}
                    disabled={isLoading === provider.id}
                    className="w-full flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">Continue with {provider.name}</span>
                    {isLoading === provider.id && <Loader2 className="h-5 w-5 animate-spin" />}
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/65">
                No OAuth providers are configured yet. Set `GITHUB_ID` / `GOOGLE_CLIENT_ID` to enable sign-in.
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-white/45">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-white/35">
          No account? The career OS works without signing in, but your job tracker
          data will only persist locally in this browser.
        </p>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center px-4 bg-black" />}>
      <SignInContent />
    </Suspense>
  );
}
