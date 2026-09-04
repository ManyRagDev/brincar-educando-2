"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BatteryLow,
  Bell,
  BookOpen,
  ChevronRight,
  Clock3,
  Flower2,
  Heart,
  Infinity,
  Leaf,
  MoonStar,
  PackageOpen,
  Palette,
  PauseCircle,
  Play,
  Search,
  Sparkles,
  Sprout,
  Sun,
  Zap,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useActiveSession } from "@/lib/journey/activeSessionStore";
import {
  MOMENT_OPTIONS,
  type MomentContext,
  type RecommendationResult,
} from "@/lib/journey/recommendation-engine";
import { OfficialDashboardRecommendation } from "./OfficialDashboardRecommendation";
import styles from "./official-dashboard.module.css";

type OfficialDashboardExperienceProps = {
  firstName: string;
  greeting: string;
  greetingEmoji: string;
  childName: string | null;
  childAge: string | null;
  childAgeMonths: number | null;
  childId: string | null;
  needsSelection: boolean;
  momentContext: MomentContext | null;
  recommendations: RecommendationResult | null;
  recommendationFailed: boolean;
  contextualPost: {
    slug: string;
    title: string;
    excerpt: string;
    thumbnail: string;
    readTime: string;
  } | null;
};

const momentIcons = {
  quick: Clock3,
  move: Zap,
  calm: Leaf,
  no_materials: PackageOpen,
  outside: Sun,
  tired_adult: BatteryLow,
} satisfies Record<MomentContext, typeof Clock3>;

const momentLabels: Record<MomentContext, string> = {
  quick: "5 minutos",
  move: "Gastar energia",
  calm: "Desacelerar",
  no_materials: "Sem materiais",
  outside: "Ao ar livre",
  tired_adult: "Pouca energia",
};

const quickCards = [
  {
    href: "/atividades",
    label: "Brincadeiras",
    detail: "Ideias para agora",
    icon: Flower2,
    tone: "sage",
  },
  {
    href: "/diario",
    label: "Memórias",
    detail: "Guarde um momento",
    icon: Heart,
    tone: "peach",
  },
  {
    href: "/jornada",
    label: "Jornada",
    detail: "Veja o caminho vivido",
    icon: Sprout,
    tone: "honey",
  },
  {
    href: "/orientacoes",
    label: "Orientações",
    detail: "Entenda esta fase",
    icon: BookOpen,
    tone: "blue",
  },
] as const;

export function OfficialDashboardExperience({
  firstName,
  greeting,
  greetingEmoji,
  childName,
  childAge,
  childAgeMonths,
  childId,
  needsSelection,
  momentContext,
  recommendations,
  recommendationFailed,
  contextualPost,
}: OfficialDashboardExperienceProps) {
  const { isAcolher } = useTheme();

  return (
    <div className={`${styles.root} ${styles.embeddedRoot}`}>
      <div className={`${styles.main} ${styles.embeddedMain}`}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Um momento de cada vez</p>
            <h1>{greeting}, {firstName}! <span aria-hidden="true">{greetingEmoji}</span></h1>
            <p className={styles.subheading}>
              {childName ? `${childName}, ${childAge}` : "Vamos preparar um momento gostoso juntos?"}
            </p>
          </div>

          <div className={styles.topActions}>
            <form className={styles.search} action="/atividades">
              <Search aria-hidden="true" />
              <input
                type="search"
                name="q"
                aria-label="Buscar no Brincar Educando"
                placeholder="Buscar uma ideia..."
              />
            </form>
            <Link href="/configuracoes" className={styles.circleButton} aria-label="Notificações e preferências">
              <Bell />
              <span aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ActiveSessionStrip />

        {childId && !needsSelection ? <MomentContextBar selected={momentContext} /> : null}

        {childId && recommendations && !needsSelection ? (
          <OfficialDashboardRecommendation
            recommendations={recommendations}
            childId={childId}
            context={momentContext}
          />
        ) : (
          <motion.section
            className={styles.hero}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isAcolher ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.heroCopy}>
              <span className={styles.heroBadge}><Sparkles /> Primeiro convite</span>
              <h2>{recommendationFailed ? "A sugestão não carregou desta vez." : needsSelection ? "Quem vai brincar agora?" : "Vamos conhecer a criança?"}</h2>
              <p>
                {recommendationFailed
                  ? "Você ainda pode escolher uma atividade simples no catálogo."
                  : needsSelection
                    ? "Escolha um perfil para manter sugestões e memórias no lugar certo."
                    : "Com a idade e os interesses, preparamos propostas mais possíveis para a rotina de vocês."}
              </p>
              <div className={styles.heroActions}>
                <Link href={recommendationFailed ? "/atividades" : "/perfil"} className={styles.primaryButton}>
                  <span><Play fill="currentColor" /></span>
                  {recommendationFailed ? "Explorar brincadeiras" : needsSelection ? "Escolher perfil" : "Criar perfil"}
                </Link>
              </div>
            </div>

            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.sunDisc}><Sun /></div>
              <div className={styles.sparkleOne}>✦</div>
              <div className={styles.sparkleTwo}>●</div>
              <Image
                src="/images/dashboard2/familia-brincando-3d.png"
                alt=""
                fill
                sizes="(max-width: 767px) 80vw, (max-width: 1200px) 42vw, 520px"
                className={styles.heroImage}
                priority
              />
            </div>
          </motion.section>
        )}

        <section className={styles.quickSection} aria-labelledby="quick-title">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>Escolha seu caminho</span>
              <h2 id="quick-title">O que cabe no agora?</h2>
            </div>
            <p>Pequenos convites, no ritmo da sua família.</p>
          </div>

          <div className={styles.quickGrid}>
            {quickCards.map(({ href, label, detail, icon: Icon, tone }, index) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: isAcolher ? 0 : 0.4, delay: isAcolher ? 0 : 0.08 * index }}
              >
                <Link href={href} className={`${styles.quickCard} ${styles[tone]}`}>
                  <span className={styles.quickIcon}><Icon fill="currentColor" /></span>
                  <strong>{label}</strong>
                  <span>{detail}</span>
                  <ChevronRight className={styles.quickArrow} />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className={styles.lowerGrid} aria-label="Conteúdos para acompanhar a fase">
          <article className={styles.discoveryCard}>
            <div className={styles.discoveryIllustration} aria-hidden="true">
              <div className={styles.softCloud} />
              <div className={styles.plantPot}><Sprout /></div>
              <div className={styles.bookShape}><BookOpen /></div>
            </div>
            <div className={styles.discoveryCopy}>
              <span className={styles.eyebrow}>Para acompanhar a fase</span>
              <h2>Entender também é uma forma de cuidar.</h2>
              <p>{childAgeMonths !== null && childAgeMonths < 24
                ? "Movimento, imitação e pequenas trocas podem virar uma brincadeira inteira."
                : "Movimento, imitação e pequenas escolhas ganham espaço no cotidiano."} Nada aqui é checklist ou comparação.</p>
              <Link href="/orientacoes">Explorar orientações <ArrowRight /></Link>
            </div>
          </article>

          <article className={styles.readingCard}>
            {contextualPost ? (
              <>
                <div className={styles.readingImage}>
                  <Image
                    src={contextualPost.thumbnail}
                    alt=""
                    fill
                    sizes="(max-width: 860px) 100vw, 360px"
                    className={styles.readingImageAsset}
                  />
                </div>
                <div className={styles.readingCopy}>
                  <span className={styles.eyebrow}>Uma leitura para esta fase</span>
                  <h2>{contextualPost.title}</h2>
                  <p>{contextualPost.excerpt}</p>
                  <span className={styles.readTime}><Clock3 /> {contextualPost.readTime}</span>
                  <Link href={`/blog/${contextualPost.slug}`}>Ler com calma <ArrowRight /></Link>
                </div>
              </>
            ) : (
              <div className={styles.readingCopy}>
                <span className={styles.eyebrow}>Uma leitura para esta fase</span>
                <h2>Informação cuidadosa, quando fizer sentido.</h2>
                <Link href="/blog">Ver todas as leituras <ArrowRight /></Link>
              </div>
            )}
          </article>
        </section>

        <article className={`${styles.memoryCard} ${styles.memoryWide}`}>
          <div className={styles.memoryTop}>
            <span className={styles.memoryIcon}><MoonStar fill="currentColor" /></span>
            <span className={styles.softPill}>Seu espaço</span>
          </div>
          <div className={styles.memoryCopy}>
            <div>
              <span className={styles.eyebrow}>Memória do dia</span>
              <h2>O que você quer guardar de hoje?</h2>
              <p>Uma frase basta. Os pequenos momentos também contam a história de vocês.</p>
            </div>
            <Link href="/diario/nova" className={styles.secondaryButton}>
              <Heart fill="currentColor" /> Guardar uma memória
            </Link>
          </div>
        </article>

        <footer className={styles.pageFooter}>
          <span><Infinity /> Feito para diferentes ritmos e formas de perceber.</span>
          <Link href="/configuracoes"><Palette /> Preferências visuais</Link>
        </footer>
      </div>
    </div>
  );
}

function MomentContextBar({ selected }: { selected: MomentContext | null }) {
  return (
    <section className={styles.contextSection} aria-labelledby="dashboard-context-title">
      <div className={styles.contextHeading}>
        <div>
          <span className={styles.eyebrow}>Uma pista, se ajudar</span>
          <h2 id="dashboard-context-title">O que cabe agora?</h2>
        </div>
        <p>A sugestão já está pronta. Ajuste apenas se quiser.</p>
      </div>
      <div className={styles.contextScroller} aria-label="Filtros para a brincadeira">
        <Link
          href="/dashboard"
          replace
          scroll={false}
          aria-current={!selected ? "true" : undefined}
          className={!selected ? styles.contextChipActive : styles.contextChip}
        >
          <span><Sparkles aria-hidden="true" /></span> Para agora
        </Link>
        {MOMENT_OPTIONS.map((option) => {
          const Icon = momentIcons[option.value];
          const active = option.value === selected;
          return (
            <Link
              key={option.value}
              href={`/dashboard?momento=${option.value}`}
              replace
              scroll={false}
              aria-current={active ? "true" : undefined}
              className={active ? styles.contextChipActive : styles.contextChip}
            >
              <span><Icon aria-hidden="true" /></span> {momentLabels[option.value]}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ActiveSessionStrip() {
  const { activityId, activitySlug, elapsedSeconds, isPaused } = useActiveSession();
  if (!activityId || !activitySlug) return null;

  const minutes = Math.floor(elapsedSeconds / 60);
  return (
    <section className={styles.sessionStrip} aria-labelledby="dashboard-session-title">
      <span className={styles.sessionIcon}><PauseCircle aria-hidden="true" /></span>
      <div>
        <span>{isPaused ? "Brincadeira pausada" : "Brincadeira acontecendo"}</span>
        <h2 id="dashboard-session-title">Querem continuar de onde pararam?</h2>
        <p>{minutes > 0 ? `${minutes} min vividos` : "Ainda no começo"}. Retomar é opcional.</p>
      </div>
      <Link href={`/atividade-ativa/${activitySlug}`}>
        Retomar <ArrowRight aria-hidden="true" />
      </Link>
    </section>
  );
}
