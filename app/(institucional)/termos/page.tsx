import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Brincar Educando",
  description: "Termos de uso e condições de utilização da plataforma Brincar Educando.",
};

export default function TermosPage() {
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
              Termos de Uso
            </h1>
            <p className="text-[var(--color-muted-foreground)] max-w-lg">
              Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">1. Aceitação dos Termos</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Ao acessar e utilizar o Brincar Educando, você concorda em cumprir e estar vinculado a estes 
                Termos de Uso. Se você não concordar com qualquer parte destes termos, não utilize nossos serviços.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">2. Descrição do Serviço</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                O Brincar Educando é uma plataforma educacional que oferece conteúdo sobre desenvolvimento 
                infantil, atividades educativas, histórias e recursos para pais e educadores. Nosso objetivo 
                é conectar a ciência do desenvolvimento infantil com o brincar do dia a dia.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">3. Cadastro e Conta</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Para acessar determinadas funcionalidades, você precisará criar uma conta. Você é responsável 
                por manter a confidencialidade de suas credenciais de login e por todas as atividades que 
                ocorrerem em sua conta.
              </p>
              <ul className="list-disc list-inside text-[var(--color-muted-foreground)] space-y-2 ml-4">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Manter sua senha segura e confidencial</li>
                <li>Notificar imediatamente qualquer uso não autorizado</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">4. Conteúdo e Propriedade Intelectual</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Todo o conteúdo disponibilizado no Brincar Educando, incluindo textos, imagens, vídeos, 
                histórias e atividades, é protegido por direitos autorais e outros direitos de propriedade 
                intelectual.
              </p>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                É permitido usar o conteúdo para fins pessoais e educativos não comerciais. É proibida 
                a reprodução, distribuição ou modificação sem autorização prévia por escrito.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">5. Conduta do Usuário</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Ao utilizar nossa plataforma, você concorda em:
              </p>
              <ul className="list-disc list-inside text-[var(--color-muted-foreground)] space-y-2 ml-4">
                <li>Não usar o serviço para fins ilegais ou não autorizados</li>
                <li>Não tentar acessar áreas restritas da plataforma</li>
                <li>Não interferir na segurança ou disponibilidade do serviço</li>
                <li>Respeitar outros usuários e suas opiniões</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">6. Limitação de Responsabilidade</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                O conteúdo do Brincar Educando é fornecido apenas para fins informativos e educativos. 
                Não substituímos orientação médica, psicológica ou educacional profissional. Sempre 
                consulte profissionais qualificados para questões específicas sobre seu filho.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">7. Modificações</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas 
                serão comunicadas aos usuários. O uso continuado da plataforma após modificações constitui 
                aceitação dos novos termos.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">8. Contato</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                Dúvidas sobre estes termos? Entre em contato conosco através do email: 
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
