export type SceneTheme = "dark" | "light";

export const SCENES = [
  { id: "request", n: "00", label: "The request", theme: "dark" },
  { id: "opportunity", n: "01", label: "A oportunidade", theme: "dark" },
  { id: "model", n: "02", label: "Cadeia de valor", theme: "dark" },
  { id: "advantage", n: "02", label: "Por que pela GAVEA", theme: "dark" },
  { id: "scale", n: "02", label: "Escala", theme: "dark" },
  { id: "platform", n: "03", label: "The platform", theme: "light" },
  { id: "why", n: "04", label: "Por que o portal", theme: "light" },
  { id: "acquisition", n: "05", label: "Novos clientes", theme: "dark" },
  { id: "pilot", n: "06", label: "Piloto", theme: "dark" },
  { id: "next", n: "07", label: "The next GAVEA", theme: "dark" },
] as const satisfies ReadonlyArray<{ id: string; n: string; label: string; theme: SceneTheme }>;

export type SceneId = (typeof SCENES)[number]["id"];

export const RESET_EVENT = "ggs:reset-demo";
