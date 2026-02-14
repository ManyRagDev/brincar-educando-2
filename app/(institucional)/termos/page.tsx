import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { FileText, User, BookOpen, ShieldAlert, Scale, Mail } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Brincar Educando",
  description:
    "Termos de uso e condições de utilização da plataforma Brincar Educando.",
};

const ULTIMA_ATUALIZACAO = "14 de fevereiro de 2026";

const resumo = [
  {
    icon: User,
    titulo: "Quem pode usar",
    texto: "Maiores de 18 anos ou responsáveis legais. O serviço é destinado a pais, mães e cuidadores.",
    cor: "text-[var(--color-primary)]",
    bg: "bg-[var(--color-primary)]/10",
  },
  {
    icon: BookOpen,
    titulo: "Conteúdo informativo",
    texto: "Nosso conteúdo é educativo. Não substitui orientação médica, psicológica ou pedagógica profissional.",
    cor: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: FileText,
    titulo: "Propriedade intelectual",
    texto: "Todo conteúdo é protegido. Uso pessoal e educativo é livre. Reprodução comercial requer autorização.",
    cor: "text-[var(--color-secondary)]",
    bg: "bg-[var(--color-secondary)]/10",
  },
  {
    icon: ShieldAlert,
    titulo: "Sua responsabilidade",
    texto: "Você é responsável pela veracidade das informações e pelo uso adequado da plataforma.",
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

export default function TermosPage() {
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
              Termos de Uso
            </h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Última atualização: {ULTIMA_ATUALIZACAO} · Leia também nossa{" "}
              <Link href="/privacidade" className="text-[var(--color-primary)] hover:underline font-semibold">
                Política de Privacidade
              </Link>
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

            <Section id="aceitacao" numero="1" titulo="Aceitação dos Termos">
              <p>
                Ao acessar ou utilizar o Brincar Educando — seja pelo site, aplicativo ou qualquer
                outro canal — você declara ter lido, compreendido e concordado com estes Termos de Uso.
              </p>
              <p>
                Se você não concordar com qualquer parte destes termos, pedimos que não utilize
                nossos serviços. O uso continuado da plataforma após qualquer alteração nos termos
                constitui aceitação das mudanças.
              </p>
              <p>
                Para utilizar a plataforma, você deve ter <strong className="text-[var(--color-foreground)]">18 anos ou mais</strong>,
                ou ser responsável legal pela criança cujos dados serão inseridos.
              </p>
            </Section>

            <Section id="servico" numero="2" titulo="Descrição do Serviço">
              <p>
                O Brincar Educando é uma plataforma digital voltada ao desenvolvimento infantil e à
                parentalidade positiva. Oferecemos:
              </p>
              <ul className="space-y-2 list-none mt-2">
                <Li>Sugestões de atividades personalizadas por faixa etária da criança.</Li>
                <Li>Diário familiar para registro de memórias e marcos do desenvolvimento.</Li>
                <Li>Artigos educativos sobre desenvolvimento infantil, sono, alimentação e parentalidade.</Li>
                <Li>Histórias infantis educativas (Brincontos) — em desenvolvimento.</Li>
                <Li>Loja curada com produtos de parceiros selecionados — em desenvolvimento.</Li>
              </ul>
              <p>
                O serviço é fornecido na modalidade <strong className="text-[var(--color-foreground)]">freemium</strong>:
                funcionalidades básicas são gratuitas; funcionalidades premium, quando disponíveis,
                serão claramente sinalizadas e cobradas separadamente.
              </p>
            </Section>

            <Section id="cadastro" numero="3" titulo="Cadastro e Conta">
              <p>
                Algumas funcionalidades exigem a criação de uma conta. Ao se cadastrar, você concorda em:
              </p>
              <ul className="space-y-2 list-none">
                <Li>Fornecer informações verdadeiras, precisas e atualizadas.</Li>
                <Li>Manter a confidencialidade de suas credenciais de acesso.</Li>
                <Li>Notificar imediatamente suspeita de uso não autorizado da conta pelo e-mail <a href="mailto:contato@brincareducando.com.br" className="text-[var(--color-primary)] hover:underline">contato@brincareducando.com.br</a>.</Li>
                <Li>Não compartilhar sua conta com terceiros.</Li>
              </ul>
              <p>
                Reservamos o direito de suspender ou encerrar contas que violem estes termos,
                sem aviso prévio em casos graves.
              </p>
            </Section>

            <Section id="menores" numero="4" titulo="Perfis de Crianças e Responsabilidade Parental">
              <p>
                A plataforma permite criar perfis de filhos para personalização das atividades.
                Ao cadastrar dados de uma criança, o responsável legal:
              </p>
              <ul className="space-y-2 list-none">
                <Li>Declara ter autoridade legal para fornecer esses dados.</Li>
                <Li>Autoriza o tratamento dos dados nos termos da nossa <Link href="/privacidade" className="text-[var(--color-primary)] hover:underline">Política de Privacidade</Link> e do Art. 14 da LGPD.</Li>
                <Li>É o único responsável pela precisão e atualização das informações da criança.</Li>
              </ul>
              <p>
                Não coletamos dados diretamente de crianças e não permitimos que menores criem
                contas independentes na plataforma.
              </p>
            </Section>

            <Section id="conteudo" numero="5" titulo="Conteúdo e Propriedade Intelectual">
              <p>
                Todo o conteúdo disponibilizado no Brincar Educando — incluindo textos, imagens,
                histórias, atividades, identidade visual e código — é protegido por direitos autorais
                (Lei nº 9.610/1998) e outros direitos de propriedade intelectual, salvo indicação contrária.
              </p>
              <div className="rounded-xl bg-[var(--color-muted)] p-4 space-y-3 mt-2">
                <div>
                  <p className="font-bold text-[var(--color-foreground)] text-xs uppercase tracking-wide mb-1">É permitido</p>
                  <ul className="space-y-1 list-none">
                    <Li>Usar o conteúdo para fins pessoais e educativos não comerciais.</Li>
                    <Li>Compartilhar links para as páginas do site.</Li>
                    <Li>Citar trechos de artigos com atribuição e link para a fonte original.</Li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-[var(--color-foreground)] text-xs uppercase tracking-wide mb-1">É proibido</p>
                  <ul className="space-y-1 list-none">
                    <Li>Reproduzir, distribuir ou modificar conteúdo para fins comerciais sem autorização escrita.</Li>
                    <Li>Extrair sistematicamente conteúdo da plataforma (scraping).</Li>
                    <Li>Remover ou alterar avisos de direitos autorais.</Li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section id="conduta" numero="6" titulo="Conduta do Usuário">
              <p>Ao utilizar o Brincar Educando, você concorda em não:</p>
              <ul className="space-y-2 list-none">
                <Li>Usar a plataforma para fins ilegais ou que violem direitos de terceiros.</Li>
                <Li>Tentar acessar áreas restritas, dados de outros usuários ou sistemas da plataforma.</Li>
                <Li>Introduzir vírus, malware ou qualquer código malicioso.</Li>
                <Li>Realizar ações que sobrecarreguem ou prejudiquem a infraestrutura da plataforma.</Li>
                <Li>Fazer-se passar por outra pessoa ou fornecer identidade falsa.</Li>
              </ul>
            </Section>

            <Section id="conteudo-usuario" numero="7" titulo="Conteúdo Criado pelo Usuário">
              <p>
                As entradas do diário familiar e outros conteúdos que você cria na plataforma são
                seus. Você mantém todos os direitos sobre eles.
              </p>
              <p>
                Ao armazenar conteúdo na plataforma, você nos concede uma licença limitada, não exclusiva
                e revogável, exclusivamente para fins técnicos de exibição, armazenamento e backup do seu conteúdo.
                Não utilizamos o conteúdo do seu diário para treinamento de modelos de IA ou qualquer outra finalidade
                além da prestação do serviço.
              </p>
            </Section>

            <Section id="isenção" numero="8" titulo="Limitação de Responsabilidade e Aviso Médico">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 font-semibold text-xs leading-relaxed">
                  O conteúdo do Brincar Educando é fornecido exclusivamente para fins informativos e educativos.
                  Não substitui orientação médica, psicológica, nutricional ou pedagógica profissional.
                  Sempre consulte profissionais de saúde qualificados para questões específicas sobre o desenvolvimento ou saúde do seu filho.
                </p>
              </div>
              <p>
                O Brincar Educando não se responsabiliza por:
              </p>
              <ul className="space-y-2 list-none">
                <Li>Danos diretos ou indiretos decorrentes do uso ou da impossibilidade de uso da plataforma.</Li>
                <Li>Interrupções temporárias do serviço por manutenção ou força maior.</Li>
                <Li>Conteúdo de terceiros linkado a partir da plataforma (incluindo links de parceiros da loja).</Li>
                <Li>Decisões tomadas com base exclusiva nas informações disponibilizadas na plataforma.</Li>
              </ul>
            </Section>

            <Section id="links-afiliados" numero="9" titulo="Links de Parceiros e Afiliados">
              <p>
                A futura seção de loja do Brincar Educando poderá conter links para produtos de parceiros
                externos. Esses links podem ser links de afiliado, o que significa que podemos receber
                uma comissão se você realizar uma compra — sem custo adicional para você.
              </p>
              <p>
                A curadoria dos produtos é feita de forma independente, com base em critérios de
                qualidade e desenvolvimento infantil. A existência de parceria comercial não influencia
                negativamente nossa avaliação.
              </p>
              <p>
                Links de afiliado serão claramente identificados nas páginas da loja.
              </p>
            </Section>

            <Section id="modificacoes" numero="10" titulo="Modificações no Serviço e nos Termos">
              <p>
                Reservamos o direito de modificar, suspender ou encerrar qualquer parte do serviço a
                qualquer momento. Avisaremos com antecedência sobre mudanças significativas.
              </p>
              <p>
                Alterações nestes Termos de Uso serão publicadas nesta página com atualização da data.
                Para mudanças substanciais, notificaremos por e-mail ou aviso na plataforma com pelo
                menos <strong className="text-[var(--color-foreground)]">30 dias de antecedência</strong>.
              </p>
            </Section>

            <Section id="rescisao" numero="11" titulo="Encerramento da Conta">
              <p>
                Você pode encerrar sua conta a qualquer momento nas configurações da plataforma
                ou solicitando pelo e-mail <a href="mailto:contato@brincareducando.com.br" className="text-[var(--color-primary)] hover:underline">contato@brincareducando.com.br</a>.
              </p>
              <p>
                Após o encerramento, seus dados pessoais serão tratados conforme nossa{" "}
                <Link href="/privacidade" className="text-[var(--color-primary)] hover:underline">Política de Privacidade</Link>.
              </p>
            </Section>

            <Section id="lei-aplicavel" numero="12" titulo="Lei Aplicável e Foro">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-muted)]">
                <Scale className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <div>
                  <p>
                    Estes Termos de Uso são regidos pelas leis da{" "}
                    <strong className="text-[var(--color-foreground)]">República Federativa do Brasil</strong>,
                    incluindo o Código de Defesa do Consumidor (Lei nº 8.078/1990), a LGPD (Lei nº 13.709/2018)
                    e o Marco Civil da Internet (Lei nº 12.965/2014).
                  </p>
                  <p className="mt-2">
                    Fica eleito o foro da comarca de <strong className="text-[var(--color-foreground)]">São Paulo/SP</strong> para
                    dirimir quaisquer controvérsias decorrentes destes Termos, com renúncia expressa a qualquer
                    outro foro, por mais privilegiado que seja.
                  </p>
                </div>
              </div>
            </Section>

            <Section id="contato" numero="13" titulo="Contato">
              <div className="rounded-xl bg-[var(--color-muted)] p-5 flex flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[var(--color-foreground)] text-xs mb-1">Dúvidas e suporte</p>
                    <a href="mailto:contato@brincareducando.com.br" className="text-[var(--color-primary)] hover:underline">
                      contato@brincareducando.com.br
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[var(--color-foreground)] text-xs mb-1">Privacidade e dados pessoais</p>
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
