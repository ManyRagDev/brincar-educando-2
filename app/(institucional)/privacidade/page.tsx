import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { Shield, Eye, Lock, Trash2, Download, Bell, Users, Globe, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Brincar Educando",
  description:
    "Saiba exatamente como o Brincar Educando coleta, usa e protege seus dados pessoais — em conformidade com a LGPD.",
};

const ULTIMA_ATUALIZACAO = "14 de fevereiro de 2026";

const resumo = [
  {
    icon: Eye,
    titulo: "O que coletamos",
    texto: "Nome, e-mail, dados do perfil da criança (nome e data de nascimento) e entradas do seu diário. Só o que é necessário.",
    cor: "text-[var(--color-primary)]",
    bg: "bg-[var(--color-primary)]/10",
  },
  {
    icon: Lock,
    titulo: "Como protegemos",
    texto: "Dados armazenados com criptografia na infraestrutura da Supabase. Nunca vendemos suas informações.",
    cor: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Users,
    titulo: "Dados das crianças",
    texto: "Tratados com atenção especial conforme o Art. 14 da LGPD. O responsável legal tem controle total.",
    cor: "text-[var(--color-secondary)]",
    bg: "bg-[var(--color-secondary)]/10",
  },
  {
    icon: Trash2,
    titulo: "Seu controle",
    texto: "Você pode acessar, corrigir, exportar ou excluir seus dados a qualquer momento, sem burocracia.",
    cor: "text-amber-600",
    bg: "bg-amber-50",
  },
];

function Section({ id, numero, titulo, children }: {
  id: string;
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-8 border-b border-[var(--color-border)] last:border-0">
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-black flex items-center justify-center">
          {numero}
        </span>
        <h2 className="font-black text-lg text-[var(--color-foreground)] leading-tight pt-1">
          {titulo}
        </h2>
      </div>
      <div className="ml-12 space-y-3 text-sm text-[var(--color-muted-foreground)] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export default function PrivacidadePage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[var(--color-background)] pt-[120px]">
        {/* Hero */}
        <div className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
          <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-2">
              Documentos legais
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-black leading-tight text-[var(--color-foreground)] mb-3">
              Política de Privacidade
            </h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Última atualização: {ULTIMA_ATUALIZACAO} · Em conformidade com a{" "}
              <strong className="text-[var(--color-foreground)]">LGPD (Lei nº 13.709/2018)</strong>
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl">
          {/* Resumo em linguagem humana */}
          <div className="py-10 border-b border-[var(--color-border)]">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-2">
              Em resumo
            </p>
            <h2 className="font-serif text-2xl font-black text-[var(--color-foreground)] mb-6">
              O essencial, sem juridiquês
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resumo.map(({ icon: Icon, titulo, texto, cor, bg }) => (
                <div key={titulo} className="card-theme p-5 flex gap-4">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${cor}`} />
                  </div>
                  <div>
                    <p className="font-black text-sm text-[var(--color-foreground)] mb-1">{titulo}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">{texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conteúdo legal completo */}
          <div className="py-4">

            <Section id="controlador" numero="1" titulo="Controlador dos Dados">
              <p>
                O controlador responsável pelo tratamento dos seus dados pessoais é o{" "}
                <strong className="text-[var(--color-foreground)]">Brincar Educando</strong>,
                plataforma digital voltada ao desenvolvimento infantil e parentalidade.
              </p>
              <p>
                <strong className="text-[var(--color-foreground)]">Contato do Encarregado (DPO):</strong>{" "}
                <a href="mailto:privacidade@brincareducando.com.br" className="text-[var(--color-primary)] hover:underline">
                  privacidade@brincareducando.com.br
                </a>
              </p>
            </Section>

            <Section id="dados-coletados" numero="2" titulo="Dados que Coletamos e por Quê">
              <p>Coletamos apenas o mínimo necessário. Veja cada categoria:</p>
              <div className="rounded-xl bg-[var(--color-muted)] p-4 space-y-3 mt-2">
                <div>
                  <p className="font-bold text-[var(--color-foreground)] text-xs uppercase tracking-wide mb-1">Dados de Cadastro</p>
                  <p>Nome completo, endereço de e-mail e senha (armazenada com hash). <em>Base legal: execução de contrato (Art. 7º, V, LGPD).</em></p>
                </div>
                <div>
                  <p className="font-bold text-[var(--color-foreground)] text-xs uppercase tracking-wide mb-1">Perfil da Criança</p>
                  <p>Nome e data de nascimento do filho — usados para personalizar as sugestões de atividades por faixa etária. <em>Base legal: consentimento do responsável legal (Art. 14, §1º, LGPD).</em></p>
                </div>
                <div>
                  <p className="font-bold text-[var(--color-foreground)] text-xs uppercase tracking-wide mb-1">Conteúdo Criado</p>
                  <p>Entradas do diário familiar, registros de memórias e anotações. Esses dados são seus — armazenados para que você possa acessá-los quando quiser. <em>Base legal: execução de contrato (Art. 7º, V, LGPD).</em></p>
                </div>
                <div>
                  <p className="font-bold text-[var(--color-foreground)] text-xs uppercase tracking-wide mb-1">Dados Técnicos</p>
                  <p>Endereço IP, tipo de dispositivo, navegador e preferências de tema. Usados para garantir o funcionamento e segurança da plataforma. <em>Base legal: legítimo interesse (Art. 7º, IX, LGPD).</em></p>
                </div>
                <div>
                  <p className="font-bold text-[var(--color-foreground)] text-xs uppercase tracking-wide mb-1">Newsletter (opcional)</p>
                  <p>E-mail para receber novidades e artigos. Só coletado se você optar por se inscrever. <em>Base legal: consentimento (Art. 7º, I, LGPD).</em></p>
                </div>
              </div>
            </Section>

            <Section id="criancas" numero="3" titulo="Dados de Crianças — Atenção Especial (Art. 14, LGPD)">
              <p>
                A LGPD (Lei nº 13.709/2018, Art. 14) exige tratamento diferenciado para dados de crianças e adolescentes.
                No Brincar Educando, <strong className="text-[var(--color-foreground)]">os dados do perfil da criança
                (nome e data de nascimento) são fornecidos e controlados exclusivamente pelo responsável legal</strong> — o pai,
                mãe ou tutor cadastrado na plataforma.
              </p>
              <ul className="space-y-2 list-none">
                <Li>Não coletamos dados diretamente de crianças.</Li>
                <Li>Não utilizamos os dados do perfil da criança para fins publicitários ou de perfilamento comercial.</Li>
                <Li>A finalidade é exclusivamente personalizar as atividades e sugestões de desenvolvimento.</Li>
                <Li>O responsável pode excluir o perfil da criança a qualquer momento nas configurações da conta.</Li>
              </ul>
            </Section>

            <Section id="uso-dos-dados" numero="4" titulo="Como Usamos seus Dados">
              <ul className="space-y-2 list-none">
                <Li>Criar e gerenciar sua conta de acesso.</Li>
                <Li>Personalizar sugestões de atividades com base na faixa etária da criança.</Li>
                <Li>Armazenar e exibir as entradas do seu diário familiar.</Li>
                <Li>Enviar comunicações sobre novidades, quando você consente.</Li>
                <Li>Melhorar a plataforma com base em dados agregados e anônimos.</Li>
                <Li>Garantir a segurança e prevenir fraudes ou uso indevido.</Li>
              </ul>
              <p className="mt-2">
                <strong className="text-[var(--color-foreground)]">Não usamos seus dados para:</strong>{" "}
                venda a terceiros, publicidade comportamental ou perfilamento automatizado com tomada de decisão
                que produza efeitos jurídicos.
              </p>
            </Section>

            <Section id="compartilhamento" numero="5" titulo="Compartilhamento de Dados">
              <p>
                <strong className="text-[var(--color-foreground)]">Não vendemos seus dados. Nunca.</strong>{" "}
                Compartilhamos informações apenas com os parceiros essenciais para o funcionamento da plataforma:
              </p>
              <div className="rounded-xl bg-[var(--color-muted)] p-4 space-y-3 mt-2">
                <div>
                  <p className="font-bold text-[var(--color-foreground)] text-xs">Supabase (infraestrutura)</p>
                  <p>Banco de dados, autenticação e armazenamento. Seus dados ficam em servidores com certificação SOC 2. Veja a política de privacidade da Supabase em supabase.com/privacy.</p>
                </div>
                <div>
                  <p className="font-bold text-[var(--color-foreground)] text-xs">Vercel (hospedagem)</p>
                  <p>Plataforma de hospedagem do site. Não processa dados pessoais além dos logs técnicos padrão.</p>
                </div>
              </div>
              <p>
                Fora dos casos acima, só compartilharemos dados quando exigido por lei ou determinação judicial,
                ou mediante seu consentimento explícito.
              </p>
            </Section>

            <Section id="transferencia-internacional" numero="6" titulo="Transferência Internacional de Dados">
              <p>
                Nossos provedores de infraestrutura (Supabase e Vercel) podem processar dados em servidores
                localizados fora do Brasil, incluindo nos Estados Unidos.
              </p>
              <p>
                Essas transferências são realizadas com base em cláusulas contratuais adequadas e mecanismos
                de proteção reconhecidos, em conformidade com o Art. 33 da LGPD e as orientações da ANPD
                (Autoridade Nacional de Proteção de Dados).
              </p>
            </Section>

            <Section id="seus-direitos" numero="7" titulo="Seus Direitos (Art. 18, LGPD)">
              <p>Você tem os seguintes direitos em relação aos seus dados pessoais:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { icon: Eye, label: "Acesso", desc: "Saber quais dados temos sobre você." },
                  { icon: Bell, label: "Correção", desc: "Corrigir dados incompletos ou incorretos." },
                  { icon: Trash2, label: "Exclusão", desc: "Pedir a remoção de seus dados." },
                  { icon: Download, label: "Portabilidade", desc: "Receber seus dados em formato aberto." },
                  { icon: Lock, label: "Anonimização", desc: "Solicitar a anonimização dos dados." },
                  { icon: Users, label: "Revogação", desc: "Retirar consentimento a qualquer momento." },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-muted)]">
                    <Icon className="h-4 w-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-[var(--color-foreground)] text-xs">{label}</p>
                      <p className="text-xs">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p>
                Para exercer qualquer um desses direitos, entre em contato pelo e-mail{" "}
                <a href="mailto:privacidade@brincareducando.com.br" className="text-[var(--color-primary)] hover:underline">
                  privacidade@brincareducando.com.br
                </a>
                . Atendemos em até <strong className="text-[var(--color-foreground)]">15 dias úteis</strong>.
              </p>
              <p>
                Você também pode registrar reclamações junto à{" "}
                <strong className="text-[var(--color-foreground)]">ANPD (Autoridade Nacional de Proteção de Dados)</strong>{" "}
                em gov.br/anpd, caso entenda que seus direitos não foram respeitados.
              </p>
            </Section>

            <Section id="cookies" numero="8" titulo="Cookies e Tecnologias Similares">
              <p>Utilizamos cookies para:</p>
              <ul className="space-y-2 list-none">
                <Li><strong className="text-[var(--color-foreground)]">Essenciais:</strong> manter sua sessão ativa e garantir o funcionamento básico da plataforma. Não podem ser desativados.</Li>
                <Li><strong className="text-[var(--color-foreground)]">Preferências:</strong> lembrar suas escolhas, como o tema visual (Vibrant ou Acolher).</Li>
                <Li><strong className="text-[var(--color-foreground)]">Análise (opcional):</strong> entender como as páginas são usadas para melhorar a experiência. Usamos dados agregados e anônimos.</Li>
              </ul>
              <p>
                Você pode gerenciar e desativar cookies não essenciais nas configurações do seu navegador.
                A desativação de cookies essenciais pode afetar o funcionamento da plataforma.
              </p>
            </Section>

            <Section id="retencao" numero="9" titulo="Retenção e Exclusão de Dados">
              <p>Mantemos seus dados pelo tempo necessário para as finalidades descritas nesta política:</p>
              <ul className="space-y-2 list-none">
                <Li>Dados de conta e perfil: enquanto sua conta estiver ativa.</Li>
                <Li>Entradas do diário: até você excluí-las ou solicitar a exclusão da conta.</Li>
                <Li>Logs técnicos: até 90 dias.</Li>
              </ul>
              <p>
                Ao excluir sua conta, seus dados pessoais serão removidos ou anonimizados em até{" "}
                <strong className="text-[var(--color-foreground)]">30 dias</strong>, exceto quando houver
                obrigação legal de retenção.
              </p>
            </Section>

            <Section id="seguranca" numero="10" titulo="Segurança dos Dados">
              <p>Adotamos medidas técnicas e organizacionais para proteger seus dados:</p>
              <ul className="space-y-2 list-none">
                <Li>Senhas armazenadas com hashing seguro (bcrypt).</Li>
                <Li>Comunicação criptografada com TLS/HTTPS em todas as conexões.</Li>
                <Li>Banco de dados com Row Level Security (RLS) — cada usuário acessa apenas seus próprios dados.</Li>
                <Li>Controle de acesso por princípio de menor privilégio.</Li>
                <Li>Infraestrutura com certificação SOC 2 Type II.</Li>
              </ul>
            </Section>

            <Section id="alteracoes" numero="11" titulo="Alterações nesta Política">
              <p>
                Podemos atualizar esta política periodicamente para refletir mudanças nos nossos serviços
                ou na legislação. Notificaremos sobre mudanças significativas por e-mail ou aviso na plataforma,
                com antecedência mínima de 30 dias.
              </p>
              <p>
                A data da última atualização está sempre indicada no topo desta página.
              </p>
            </Section>

            <Section id="contato" numero="12" titulo="Contato">
              <div className="rounded-xl bg-[var(--color-muted)] p-5 flex flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[var(--color-foreground)] text-xs mb-1">E-mail geral</p>
                    <a href="mailto:contato@brincareducando.com.br" className="text-[var(--color-primary)] hover:underline">
                      contato@brincareducando.com.br
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[var(--color-foreground)] text-xs mb-1">Encarregado de Dados (DPO)</p>
                    <a href="mailto:privacidade@brincareducando.com.br" className="text-[var(--color-primary)] hover:underline">
                      privacidade@brincareducando.com.br
                    </a>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
