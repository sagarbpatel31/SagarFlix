import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { getOptionalEnv } from "@/lib/env";

export function getAuthProviderConfigs() {
  const githubClientId = getOptionalEnv("GITHUB_ID");
  const githubClientSecret = getOptionalEnv("GITHUB_SECRET");
  const googleClientId = getOptionalEnv("GOOGLE_CLIENT_ID");
  const googleClientSecret = getOptionalEnv("GOOGLE_CLIENT_SECRET");

  return [
    ...(githubClientId && githubClientSecret
      ? [
          GitHubProvider({
            clientId: githubClientId,
            clientSecret: githubClientSecret,
          }),
        ]
      : []),
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : []),
  ];
}

