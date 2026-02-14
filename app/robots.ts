import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/blog/", "/sobre", "/loja"],
        disallow: ["/dashboard", "/atividades", "/diario", "/historias", "/perfil", "/admin", "/auth"],
      },
    ],
    sitemap: "https://brincareducando.com.br/sitemap.xml",
  };
}
