import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Brincar Educando",
  description: "Saiba como o Brincar Educando coleta, usa e protege suas informações pessoais.",
};

export default function PrivacidadePage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[var(--color-background)] pt-[120px]">
        <div className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-2">
              Documentos legais
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-black leading-tight text-[var(--color-foreground)] mb-4">
              Política de Privacidade
            </h1>
            <p className="text-[var(--color-muted-foreground)] max-w-lg">
              Sua privacidade é importante para nós. Esta política explica como tratamos seus dados.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">1. Introdução</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                O Brincar Educando está comprometido em proteger sua privacidade. Esta Política de 
                Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações 
                pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">2. Informações que Coletamos</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Coletamos apenas as informações necessárias para fornecer nossos serviços:
              </p>
              <ul className="list-disc list-inside text-[var(--color-muted-foreground)] space-y-2 ml-4">
                <li><strong>Informações de cadastro:</strong> nome, e-mail, senha</li>
                <li><strong>Dados do perfil:</strong> nome da criança, idade, preferências de tema</li>
                <li><strong>Conteúdo criado:</strong> entradas do diário, anotações, atividades realizadas</li>
                <li><strong>Dados técnicos:</strong> endereço IP, tipo de navegador, cookies</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">3. Como Usamos suas Informações</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Utilizamos seus dados para:
              </p>
              <ul className="list-disc list-inside text-[var(--color-muted-foreground)] space-y-2 ml-4">
                <li>Fornecer e personalizar nossos serviços</li>
                <li>Criar e gerenciar sua conta</li>
                <li>Enviar comunicações sobre novidades e atualizações (com seu consentimento)</li>
                <li>Melhorar nossa plataforma e experiência do usuário</li>
                <li>Garantir a segurança e integridade do serviço</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">4. Proteção de Dados</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
                informações contra acesso não autorizado, alteração, divulgação ou destruição:
              </p>
              <ul className="list-disc list-inside text-[var(--color-muted-foreground)] space-y-2 ml-4">
                <li>Criptografia de dados sensíveis</li>
                <li>Servidores seguros e monitorados</li>
                <li>Acesso restrito a funcionários autorizados</li>
                <li>Auditorias regulares de segurança</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">5. Compartilhamento de Dados</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Não vendemos suas informações pessoais. Compartilhamos dados apenas:
              </p>
              <ul className="list-disc list-inside text-[var(--color-muted-foreground)] space-y-2 ml-4">
                <li>Com prestadores de serviço essenciais (hospedagem, autenticação)</li>
                <li>Quando exigido por lei ou autoridade competente</li>
                <li>Com seu consentimento explícito</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">6. Seus Direitos (LGPD)</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                De acordo com a LGPD, você tem os seguintes direitos:
              </p>
              <ul className="list-disc list-inside text-[var(--color-muted-foreground)] space-y-2 ml-4">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimento a qualquer momento</li>
                <li>Solicitar portabilidade dos dados</li>
                <li>Obter informações sobre o compartilhamento</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">7. Cookies</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Utilizamos cookies para melhorar sua experiência, lembrar suas preferências (como o tema 
                visual) e entender como nossa plataforma é utilizada. Você pode gerenciar cookies através 
                das configurações do seu navegador.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">8. Retenção de Dados</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades descritas 
                nesta política ou conforme exigido por lei. Ao excluir sua conta, seus dados serão 
                removidos ou anonimizados em até 30 dias.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">9. Crianças e Adolescentes</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Nosso serviço é destinado aos pais e responsáveis. Não coletamos intencionalmente dados 
                de crianças menores de 13 anos sem consentimento dos pais. Se identificarmos dados de 
                menores coletados indevidamente, tomaremos medidas para remover essas informações.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">10. Alterações na Política</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
                através do e-mail cadastrado ou aviso na plataforma.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">11. Contato</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato:
              </p>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mt-2">
                <strong>E-mail:</strong>{" "}
                <a href="mailto:contato@brincareducando.com.br" className="text-[var(--color-primary)] hover:underline">
                  contato@brincareducando.com.br
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
