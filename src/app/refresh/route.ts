import { getProjects } from "@/lib/google-projects";
import { Token } from "@/type";
import { formDataToJson } from "@/utils";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const { refresh_token: refreshToken } = formDataToJson(body);
  const redirect_uri = `${request.nextUrl.origin}/callback`;

  let lastError: AxiosError | undefined;

  for (const project of getProjects()) {
    try {
      const { data: token } = await axios.post<Token>(
        "https://oauth2.googleapis.com/token",
        {
          client_id: project.id,
          client_secret: project.secret,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          redirect_uri,
        }
      );
      return NextResponse.json(token);
    } catch (e) {
      const err = e as AxiosError;
      const status = err.response?.status;
      if (status === 400 || status === 401) {
        lastError = err;
        continue; // wrong project for this token, try the next one
      }
      throw e;
    }
  }

  return NextResponse.json(lastError?.response?.data ?? "Refresh failed", {
    status: lastError?.response?.status ?? 500,
  });
}
