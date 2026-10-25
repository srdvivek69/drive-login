import { getProject } from "@/lib/google-projects";
import { Token, UserData } from "@/type";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const home = new URL("/", request.nextUrl.origin);

  const [pin, projectKey] = (searchParams.get("state") ?? "").split("|");
  const code = searchParams.get("code") as string;
  const scope = searchParams.get("scope") as string;
  const redirect_uri = `${request.nextUrl.origin}/callback`;

  const project = getProject(projectKey);

  if (!pin || !code || !project) {
    return NextResponse.redirect(home);
  }

  let token: Token;
  try {
    const res = await axios.post<Token>("https://oauth2.googleapis.com/token", {
      client_id: project.id,
      client_secret: project.secret,
      grant_type: "authorization_code",
      redirect_uri,
      code,
      scope,
    });
    token = res.data;
  } catch (e) {
    console.error("Token exchange failed", (e as any)?.response?.data);
    return NextResponse.redirect(home);
  }

  const key = pin.toLowerCase();
  const userData = cacheInstance.get(key) as UserData;
  const ttl = cacheInstance.getTtl(key);

  if (!userData || !ttl) {
    return NextResponse.redirect(home);
  }

  cacheInstance.set(key, { ...userData, token }, ttl);

  return NextResponse.redirect(`${request.nextUrl.origin}/success`);
}
