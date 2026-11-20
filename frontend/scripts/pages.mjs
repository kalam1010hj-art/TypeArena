import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer, loadEnv } from "vite";
import { routing } from "../src/pages.js";
const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };
const origin = (
  env.VITE_SITE_URL ||
  (env.VERCEL_PROJECT_PRODUCTION_URL &&
    "https://" + env.VERCEL_PROJECT_PRODUCTION_URL) ||
  ""
).replace(/\/$/, "");
const template = await readFile("dist/index.html", "utf8");
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const { render } = await server.ssrLoadModule("/src/render.jsx");
  for (const [path, [title, desc]] of Object.entries({
    ...routing,
    "/404": ["Page not found", "Return to TypeArena."],
  })) {
    const url = origin + path;
    const schema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "TypeArena",
      ...(origin ? { url: origin } : {}),
    });
    const html = template
      .replace(
        "</head>",
        path === "/"
          ? '<script type="application/ld+json">' + schema + "</script></head>"
          : "</head>",
      )
      .replace("<title>TypeArena</title>", "<title>" + title + "</title>")
      .replaceAll('content="Keyboard practice"', 'content="' + desc + '"')
      .replace(
        'property="og:title" content="TypeArena"',
        'property="og:title" content="' + title + '"',
      )
      .replace(
        'property="og:url" content=""',
        'property="og:url" content="' + url + '"',
      )
      .replace('rel="canonical" href=""', 'rel="canonical" href="' + url + '"')
      .replace(
        '<div id="root"></div>',
        () => '<div id="root">' + render(path) + "</div>",
      );
    const dir = "dist" + (path === "/" ? "" : path);
    if (path === "/404") await writeFile("dist/404.html", html);
    else {
      await mkdir(dir, { recursive: true });
      await writeFile(dir + "/index.html", html);
    }
  }
  if (origin)
    await writeFile(
      "dist/sitemap.xml",
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        Object.keys(routing)
          .map((p) => "<url><loc>" + origin + p + "</loc></url>")
          .join("") +
        "</urlset>",
    );
  await writeFile(
    "dist/robots.txt",
    "User-agent: *\nAllow: /\n" +
      (origin ? "Sitemap: " + origin + "/sitemap.xml\n" : ""),
  );
} finally {
  await server.close();
}
