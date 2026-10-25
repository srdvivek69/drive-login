"use server";

import { getProject } from "@/lib/google-projects";

export async function getGoogleAuthUrl(
  pin: string,
  redirectUri: string,
  project?: string
) {
  const selected = getProject(project);
  const params = new URLSearchParams();

  params.append("client_id", selected.id);
  params.append("redirect_uri", redirectUri);
  params.append("state", `${pin}|${selected.key}`);
  params.append("response_type", "code");
  params.append(
    "scope",
    "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/photoslibrary.readonly profile"
  );
  params.append("access_type", "offline");
  params.append("prompt", "consent");

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
