export type GoogleProject = { key: string; id: string; secret: string };

export function getProjects(): GoogleProject[] {
  return [
    {
      key: "1",
      id: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET,
    },
    {
      key: "2",
      id: process.env.GOOGLE_CLIENT_ID_2,
      secret: process.env.GOOGLE_CLIENT_SECRET_2,
    },
  ].filter((p) => p.id && p.secret) as GoogleProject[];
}

export function getProject(key?: string) {
  const projects = getProjects();
  return projects.find((p) => p.key === key) ?? projects[0];
}
