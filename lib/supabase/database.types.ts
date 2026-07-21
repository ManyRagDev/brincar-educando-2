// Generated from the remote Supabase catalog via MCP on 2026-07-20.
// Regenerate after every schema migration; do not edit entity shapes by hand.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  brincareducando: {
    Tables: {
      atividades: {
        Row: {
          id: string;
          titulo: string;
          descricao: string | null;
          categoria: string | null;
          faixa_etaria_min: number | null;
          faixa_etaria_max: number | null;
          materiais: string[] | null;
          passos: Json | null;
          beneficios: string[] | null;
          tempo_estimado_minutos: number | null;
          imagem_url: string | null;
          publicado: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          habilidades: string[] | null;
          energia: string | null;
          preparo_minutos: number | null;
          dicas: string[] | null;
          idade_min_meses: number | null;
          idade_max_meses: number | null;
          duracao_minutos: number | null;
          dificuldade: string | null;
          local: string | null;
          codigo_externo: string | null;
          slug: string | null;
          resumo: string | null;
          justificativa_fase: string | null;
          dominio_primario: string | null;
          dominios_secundarios: string[];
          energia_adulto: string | null;
          nivel_bagunca: string | null;
          participantes_min: number;
          participantes_max: number | null;
          materiais_estruturados: Json;
          preparacao: string[];
          encerramento: string[];
          prompts_interacao: string[];
          sinais_interesse: string[];
          sinais_adaptar_parar: string[];
          variacoes: Json;
          adaptacoes_inclusivas: Json;
          seguranca: Json;
          status_editorial: string;
          conteudo_versao: number;
          revisado_por: string | null;
          revisado_em: string | null;
          proxima_revisao: string | null;
        };
        Insert: {
          id?: string;
          titulo: string;
          descricao?: string | null;
          categoria?: string | null;
          faixa_etaria_min?: number | null;
          faixa_etaria_max?: number | null;
          materiais?: string[] | null;
          passos?: Json | null;
          beneficios?: string[] | null;
          tempo_estimado_minutos?: number | null;
          imagem_url?: string | null;
          publicado?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          habilidades?: string[] | null;
          energia?: string | null;
          preparo_minutos?: number | null;
          dicas?: string[] | null;
          idade_min_meses?: number | null;
          idade_max_meses?: number | null;
          duracao_minutos?: number | null;
          dificuldade?: string | null;
          local?: string | null;
          codigo_externo?: string | null;
          slug?: string | null;
          resumo?: string | null;
          justificativa_fase?: string | null;
          dominio_primario?: string | null;
          dominios_secundarios?: string[];
          energia_adulto?: string | null;
          nivel_bagunca?: string | null;
          participantes_min?: number;
          participantes_max?: number | null;
          materiais_estruturados?: Json;
          preparacao?: string[];
          encerramento?: string[];
          prompts_interacao?: string[];
          sinais_interesse?: string[];
          sinais_adaptar_parar?: string[];
          variacoes?: Json;
          adaptacoes_inclusivas?: Json;
          seguranca?: Json;
          status_editorial?: string;
          conteudo_versao?: number;
          revisado_por?: string | null;
          revisado_em?: string | null;
          proxima_revisao?: string | null;
        };
        Update: {
          id?: string;
          titulo?: string;
          descricao?: string | null;
          categoria?: string | null;
          faixa_etaria_min?: number | null;
          faixa_etaria_max?: number | null;
          materiais?: string[] | null;
          passos?: Json | null;
          beneficios?: string[] | null;
          tempo_estimado_minutos?: number | null;
          imagem_url?: string | null;
          publicado?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          habilidades?: string[] | null;
          energia?: string | null;
          preparo_minutos?: number | null;
          dicas?: string[] | null;
          idade_min_meses?: number | null;
          idade_max_meses?: number | null;
          duracao_minutos?: number | null;
          dificuldade?: string | null;
          local?: string | null;
          codigo_externo?: string | null;
          slug?: string | null;
          resumo?: string | null;
          justificativa_fase?: string | null;
          dominio_primario?: string | null;
          dominios_secundarios?: string[];
          energia_adulto?: string | null;
          nivel_bagunca?: string | null;
          participantes_min?: number;
          participantes_max?: number | null;
          materiais_estruturados?: Json;
          preparacao?: string[];
          encerramento?: string[];
          prompts_interacao?: string[];
          sinais_interesse?: string[];
          sinais_adaptar_parar?: string[];
          variacoes?: Json;
          adaptacoes_inclusivas?: Json;
          seguranca?: Json;
          status_editorial?: string;
          conteudo_versao?: number;
          revisado_por?: string | null;
          revisado_em?: string | null;
          proxima_revisao?: string | null;
        };
        Relationships: [];
      };
      atividades_adaptacoes: {
        Row: {
          id: string;
          atividade_id: string;
          contexto: string;
          titulo: string;
          orientacao: string;
          ordem: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          atividade_id: string;
          contexto: string;
          titulo: string;
          orientacao: string;
          ordem?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          atividade_id?: string;
          contexto?: string;
          titulo?: string;
          orientacao?: string;
          ordem?: number;
          created_at?: string;
        };
        Relationships: [{
          foreignKeyName: "atividades_adaptacoes_atividade_id_fkey";
          columns: ["atividade_id"];
          isOneToOne: false;
          referencedRelation: "atividades";
          referencedColumns: ["id"];
        }];
      };
      atividades_fontes: {
        Row: {
          atividade_id: string;
          fonte_id: string;
          afirmacao_sustentada: string;
          created_at: string;
        };
        Insert: {
          atividade_id: string;
          fonte_id: string;
          afirmacao_sustentada: string;
          created_at?: string;
        };
        Update: {
          atividade_id?: string;
          fonte_id?: string;
          afirmacao_sustentada?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "atividades_fontes_atividade_id_fkey";
            columns: ["atividade_id"];
            isOneToOne: false;
            referencedRelation: "atividades";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "atividades_fontes_fonte_id_fkey";
            columns: ["fonte_id"];
            isOneToOne: false;
            referencedRelation: "conteudos_fontes";
            referencedColumns: ["id"];
          },
        ];
      };
      atividades_execucoes: {
        Row: {
          id: string;
          usuario_id: string;
          crianca_id: string;
          atividade_id: string;
          data_conclusao: string | null;
          duracao_minutos: number | null;
          avaliacao: number | null;
          notas: string | null;
          fotos_urls: string[] | null;
          habilidades_desbloqueadas: string[] | null;
          created_at: string | null;
          percepcao: string | null;
          observacoes_sinais: string[];
          motivo_encerramento: string | null;
          atividade_versao: number | null;
          recomendacao_chave: string | null;
          contexto_recomendacao: string | null;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          crianca_id: string;
          atividade_id: string;
          data_conclusao?: string | null;
          duracao_minutos?: number | null;
          avaliacao?: number | null;
          notas?: string | null;
          fotos_urls?: string[] | null;
          habilidades_desbloqueadas?: string[] | null;
          created_at?: string | null;
          percepcao?: string | null;
          observacoes_sinais?: string[];
          motivo_encerramento?: string | null;
          atividade_versao?: number | null;
          recomendacao_chave?: string | null;
          contexto_recomendacao?: string | null;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          crianca_id?: string;
          atividade_id?: string;
          data_conclusao?: string | null;
          duracao_minutos?: number | null;
          avaliacao?: number | null;
          notas?: string | null;
          fotos_urls?: string[] | null;
          habilidades_desbloqueadas?: string[] | null;
          created_at?: string | null;
          percepcao?: string | null;
          observacoes_sinais?: string[];
          motivo_encerramento?: string | null;
          atividade_versao?: number | null;
          recomendacao_chave?: string | null;
          contexto_recomendacao?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "atividades_execucoes_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "usuarios";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "atividades_execucoes_atividade_id_fkey";
            columns: ["atividade_id"];
            isOneToOne: false;
            referencedRelation: "atividades";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "atividades_execucoes_crianca_owner_fkey";
            columns: ["crianca_id","usuario_id"];
            isOneToOne: false;
            referencedRelation: "criancas";
            referencedColumns: ["id","usuario_id"];
          },
        ];
      };
      brincadeiras: {
        Row: {
          id: string;
          titulo: string;
          descricao: string | null;
          categoria: string | null;
          faixa_etaria_min: number | null;
          faixa_etaria_max: number | null;
          materiais: Json | null;
          passos: Json | null;
          beneficios: string[] | null;
          tempo_estimado_minutos: number | null;
          imagem_url: string | null;
          created_at: string | null;
          updated_at: string | null;
          publicado: boolean | null;
        };
        Insert: {
          id?: string;
          titulo: string;
          descricao?: string | null;
          categoria?: string | null;
          faixa_etaria_min?: number | null;
          faixa_etaria_max?: number | null;
          materiais?: Json | null;
          passos?: Json | null;
          beneficios?: string[] | null;
          tempo_estimado_minutos?: number | null;
          imagem_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          publicado?: boolean | null;
        };
        Update: {
          id?: string;
          titulo?: string;
          descricao?: string | null;
          categoria?: string | null;
          faixa_etaria_min?: number | null;
          faixa_etaria_max?: number | null;
          materiais?: Json | null;
          passos?: Json | null;
          beneficios?: string[] | null;
          tempo_estimado_minutos?: number | null;
          imagem_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          publicado?: boolean | null;
        };
        Relationships: [];
      };
      conteudos_fontes: {
        Row: {
          id: string;
          slug: string;
          titulo: string;
          organizacao_autoria: string;
          url: string;
          doi: string | null;
          publicado_em: string | null;
          tipo_evidencia: string;
          resumo_editorial: string;
          consultado_em: string;
          proxima_revisao: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          titulo: string;
          organizacao_autoria: string;
          url: string;
          doi?: string | null;
          publicado_em?: string | null;
          tipo_evidencia: string;
          resumo_editorial: string;
          consultado_em: string;
          proxima_revisao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          titulo?: string;
          organizacao_autoria?: string;
          url?: string;
          doi?: string | null;
          publicado_em?: string | null;
          tipo_evidencia?: string;
          resumo_editorial?: string;
          consultado_em?: string;
          proxima_revisao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      criancas: {
        Row: {
          id: string;
          usuario_id: string;
          nome: string;
          data_nascimento: string;
          genero: string | null;
          avatar_id: string | null;
          interesses: Json | null;
          created_at: string | null;
          updated_at: string | null;
          cor_favorita: string | null;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          nome: string;
          data_nascimento: string;
          genero?: string | null;
          avatar_id?: string | null;
          interesses?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
          cor_favorita?: string | null;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          nome?: string;
          data_nascimento?: string;
          genero?: string | null;
          avatar_id?: string | null;
          interesses?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
          cor_favorita?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "criancas_usuario_id_fkey1";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "usuarios";
            referencedColumns: ["id"];
          },
        ];
      };
      diario_entradas: {
        Row: {
          id: string;
          usuario_id: string;
          crianca_id: string;
          titulo: string | null;
          conteudo: string;
          humor: string | null;
          tags: string[] | null;
          data_entrada: string;
          created_at: string;
          tipo_registro: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          crianca_id: string;
          titulo?: string | null;
          conteudo: string;
          humor?: string | null;
          tags?: string[] | null;
          data_entrada?: string;
          created_at?: string;
          tipo_registro?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          crianca_id?: string;
          titulo?: string | null;
          conteudo?: string;
          humor?: string | null;
          tags?: string[] | null;
          data_entrada?: string;
          created_at?: string;
          tipo_registro?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "diario_entradas_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "diario_entradas_crianca_owner_fkey";
            columns: ["crianca_id","usuario_id"];
            isOneToOne: false;
            referencedRelation: "criancas";
            referencedColumns: ["id","usuario_id"];
          },
        ];
      };
      diario_midias: {
        Row: {
          id: string;
          usuario_id: string;
          crianca_id: string;
          diario_entrada_id: string;
          storage_path: string;
          mime_type: string;
          tamanho_bytes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          crianca_id: string;
          diario_entrada_id: string;
          storage_path: string;
          mime_type: string;
          tamanho_bytes: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          crianca_id?: string;
          diario_entrada_id?: string;
          storage_path?: string;
          mime_type?: string;
          tamanho_bytes?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "diario_midias_crianca_owner_fkey";
            columns: ["crianca_id","usuario_id"];
            isOneToOne: false;
            referencedRelation: "criancas";
            referencedColumns: ["id","usuario_id"];
          },
          {
            foreignKeyName: "diario_midias_entrada_owner_fkey";
            columns: ["diario_entrada_id","usuario_id"];
            isOneToOne: false;
            referencedRelation: "diario_entradas";
            referencedColumns: ["id","usuario_id"];
          },
        ];
      };
      diario_momentos: {
        Row: {
          id: string;
          user_id: string;
          perfil_crianca_id: string | null;
          texto: string;
          data_registro: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          perfil_crianca_id?: string | null;
          texto: string;
          data_registro?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          perfil_crianca_id?: string | null;
          texto?: string;
          data_registro?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "diario_momentos_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "diario_momentos_perfil_crianca_id_fkey";
            columns: ["perfil_crianca_id"];
            isOneToOne: false;
            referencedRelation: "perfis_criancas";
            referencedColumns: ["id"];
          },
        ];
      };
      historias: {
        Row: {
          id: string;
          titulo: string;
          descricao: string | null;
          capa_url: string | null;
          faixa_etaria_min: number;
          faixa_etaria_max: number;
          duracao_minutos: number | null;
          publicado: boolean | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
          slug: string;
          tema: string | null;
          momento: string;
          proposta_familiar: string | null;
          linguagem_acessivel: string | null;
          status_editorial: string;
          conteudo_versao: number;
          revisado_por: string | null;
          revisado_em: string | null;
          proxima_revisao: string | null;
        };
        Insert: {
          id?: string;
          titulo: string;
          descricao?: string | null;
          capa_url?: string | null;
          faixa_etaria_min?: number;
          faixa_etaria_max?: number;
          duracao_minutos?: number | null;
          publicado?: boolean | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          slug?: string;
          tema?: string | null;
          momento?: string;
          proposta_familiar?: string | null;
          linguagem_acessivel?: string | null;
          status_editorial?: string;
          conteudo_versao?: number;
          revisado_por?: string | null;
          revisado_em?: string | null;
          proxima_revisao?: string | null;
        };
        Update: {
          id?: string;
          titulo?: string;
          descricao?: string | null;
          capa_url?: string | null;
          faixa_etaria_min?: number;
          faixa_etaria_max?: number;
          duracao_minutos?: number | null;
          publicado?: boolean | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          slug?: string;
          tema?: string | null;
          momento?: string;
          proposta_familiar?: string | null;
          linguagem_acessivel?: string | null;
          status_editorial?: string;
          conteudo_versao?: number;
          revisado_por?: string | null;
          revisado_em?: string | null;
          proxima_revisao?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "historias_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      historias_audios: {
        Row: {
          id: string;
          historia_id: string;
          audio_url: string;
          duracao_segundos: number | null;
          narrador: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          historia_id: string;
          audio_url: string;
          duracao_segundos?: number | null;
          narrador?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          historia_id?: string;
          audio_url?: string;
          duracao_segundos?: number | null;
          narrador?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "historias_audios_historia_id_fkey";
            columns: ["historia_id"];
            isOneToOne: false;
            referencedRelation: "historias";
            referencedColumns: ["id"];
          },
        ];
      };
      historias_textos: {
        Row: {
          id: string;
          historia_id: string;
          ordem: number;
          conteudo: string;
          created_at: string | null;
          titulo_pagina: string | null;
          texto_alternativo: string | null;
          imagem_url: string | null;
          prompt_pausa: string | null;
        };
        Insert: {
          id?: string;
          historia_id: string;
          ordem: number;
          conteudo: string;
          created_at?: string | null;
          titulo_pagina?: string | null;
          texto_alternativo?: string | null;
          imagem_url?: string | null;
          prompt_pausa?: string | null;
        };
        Update: {
          id?: string;
          historia_id?: string;
          ordem?: number;
          conteudo?: string;
          created_at?: string | null;
          titulo_pagina?: string | null;
          texto_alternativo?: string | null;
          imagem_url?: string | null;
          prompt_pausa?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "historias_textos_historia_id_fkey";
            columns: ["historia_id"];
            isOneToOne: false;
            referencedRelation: "historias";
            referencedColumns: ["id"];
          },
        ];
      };
      historias_prompts: {
        Row: { id: string; historia_id: string; tipo: string; pergunta: string; orientacao_adulto: string | null; ordem: number; created_at: string; };
        Insert: { id?: string; historia_id: string; tipo: string; pergunta: string; orientacao_adulto?: string | null; ordem?: number; created_at?: string; };
        Update: { id?: string; historia_id?: string; tipo?: string; pergunta?: string; orientacao_adulto?: string | null; ordem?: number; created_at?: string; };
        Relationships: [];
      };
      historias_extensoes: {
        Row: { id: string; historia_id: string; titulo: string; descricao: string; tipo: string; materiais: string[]; duracao_minutos: number | null; ordem: number; created_at: string; };
        Insert: { id?: string; historia_id: string; titulo: string; descricao: string; tipo?: string; materiais?: string[]; duracao_minutos?: number | null; ordem?: number; created_at?: string; };
        Update: { id?: string; historia_id?: string; titulo?: string; descricao?: string; tipo?: string; materiais?: string[]; duracao_minutos?: number | null; ordem?: number; created_at?: string; };
        Relationships: [];
      };
      historias_fontes: {
        Row: { historia_id: string; fonte_id: string; afirmacao_sustentada: string; created_at: string; };
        Insert: { historia_id: string; fonte_id: string; afirmacao_sustentada: string; created_at?: string; };
        Update: { historia_id?: string; fonte_id?: string; afirmacao_sustentada?: string; created_at?: string; };
        Relationships: [];
      };
      historias_sessoes: {
        Row: { id: string; usuario_id: string; crianca_id: string; historia_id: string; pagina_atual: number; concluida: boolean; nota_familiar: string | null; sinais_observados: string[]; conteudo_versao: number; iniciada_em: string; atualizada_em: string; };
        Insert: { id?: string; usuario_id: string; crianca_id: string; historia_id: string; pagina_atual?: number; concluida?: boolean; nota_familiar?: string | null; sinais_observados?: string[]; conteudo_versao?: number; iniciada_em?: string; atualizada_em?: string; };
        Update: { id?: string; usuario_id?: string; crianca_id?: string; historia_id?: string; pagina_atual?: number; concluida?: boolean; nota_familiar?: string | null; sinais_observados?: string[]; conteudo_versao?: number; iniciada_em?: string; atualizada_em?: string; };
        Relationships: [];
      };
      historico: {
        Row: {
          id: string;
          usuario_id: string;
          crianca_id: string;
          historia_id: string;
          tipo: string;
          progresso_segundos: number | null;
          concluido: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          crianca_id: string;
          historia_id: string;
          tipo: string;
          progresso_segundos?: number | null;
          concluido?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          crianca_id?: string;
          historia_id?: string;
          tipo?: string;
          progresso_segundos?: number | null;
          concluido?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "historico_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "usuarios";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "historico_historia_id_fkey";
            columns: ["historia_id"];
            isOneToOne: false;
            referencedRelation: "historias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "historico_crianca_owner_fkey";
            columns: ["crianca_id","usuario_id"];
            isOneToOne: false;
            referencedRelation: "criancas";
            referencedColumns: ["id","usuario_id"];
          },
        ];
      };
      marcos_alcancados: {
        Row: {
          id: string;
          user_id: string;
          perfil_crianca_id: string;
          marco_id: string;
          data_alcancado: string | null;
          notas: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          perfil_crianca_id: string;
          marco_id: string;
          data_alcancado?: string | null;
          notas?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          perfil_crianca_id?: string;
          marco_id?: string;
          data_alcancado?: string | null;
          notas?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "marcos_alcancados_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "marcos_alcancados_perfil_crianca_id_fkey";
            columns: ["perfil_crianca_id"];
            isOneToOne: false;
            referencedRelation: "perfis_criancas";
            referencedColumns: ["id"];
          },
        ];
      };
      perfis_criancas: {
        Row: {
          id: string;
          usuario_id: string;
          nome: string;
          data_nascimento: string;
          apelido: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          nome: string;
          data_nascimento: string;
          apelido?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          nome?: string;
          data_nascimento?: string;
          apelido?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "criancas_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "usuarios";
            referencedColumns: ["id"];
          },
        ];
      };
      revisoes_conteudo: {
        Row: {
          id: string;
          atividade_id: string;
          tipo: string;
          status: string;
          revisor: string;
          parecer: string;
          revisado_em: string;
          proxima_revisao: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          atividade_id: string;
          tipo: string;
          status: string;
          revisor: string;
          parecer: string;
          revisado_em?: string;
          proxima_revisao?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          atividade_id?: string;
          tipo?: string;
          status?: string;
          revisor?: string;
          parecer?: string;
          revisado_em?: string;
          proxima_revisao?: string | null;
          created_at?: string;
        };
        Relationships: [{
          foreignKeyName: "revisoes_conteudo_atividade_id_fkey";
          columns: ["atividade_id"];
          isOneToOne: false;
          referencedRelation: "atividades";
          referencedColumns: ["id"];
        }];
      };
      recomendacoes_eventos: {
        Row: {
          id: string;
          usuario_id: string;
          crianca_id: string;
          atividade_id: string | null;
          tipo: string;
          contexto: string | null;
          motivo: string | null;
          recomendacao_chave: string;
          regra_versao: string;
          posicao: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          crianca_id: string;
          atividade_id?: string | null;
          tipo: string;
          contexto?: string | null;
          motivo?: string | null;
          recomendacao_chave: string;
          regra_versao?: string;
          posicao?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          crianca_id?: string;
          atividade_id?: string | null;
          tipo?: string;
          contexto?: string | null;
          motivo?: string | null;
          recomendacao_chave?: string;
          regra_versao?: string;
          posicao?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recomendacoes_eventos_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recomendacoes_eventos_atividade_id_fkey";
            columns: ["atividade_id"];
            isOneToOne: false;
            referencedRelation: "atividades";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recomendacoes_eventos_crianca_owner_fkey";
            columns: ["crianca_id","usuario_id"];
            isOneToOne: false;
            referencedRelation: "criancas";
            referencedColumns: ["id","usuario_id"];
          },
        ];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: Database["brincareducando"]["Enums"]["app_role"];
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: Database["brincareducando"]["Enums"]["app_role"];
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: Database["brincareducando"]["Enums"]["app_role"];
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      usuarios: {
        Row: {
          id: string;
          nome: string;
          email: string;
          telefone: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          nome: string;
          email: string;
          telefone?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          nome?: string;
          email?: string;
          telefone?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "usuarios_id_fkey";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      current_user_has_manylabs_app_access: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      ensure_manylabs_app_access: {
        Args: {
          p_email: string;
          p_user_id: string;
          p_display_name: string;
        };
        Returns: boolean;
      };
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      has_manylabs_app_access: {
        Args: {
          p_user_id: string;
        };
        Returns: boolean;
      };
      has_role: {
        Args: {
          _role: Database["brincareducando"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      quality_snapshot: {
        Args: Record<PropertyKey, never>;
        Returns: {
          atividades_publicadas: number;
          atividades_revisao_pendente: number;
          atividades_revisao_vencida: number;
          historias_publicadas: number;
          historias_revisao_vencida: number;
          atividades_por_faixa: Json;
          atividades_por_contexto: Json;
        }[];
      };
      update_updated_at_column: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      upsert_child_with_profile: {
        Args: {
          p_nome: string;
          p_genero: string;
          p_avatar_id: string;
          p_interesses: Json;
          p_cor_favorita: string;
          p_data_nascimento: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: Record<never, never>;
  };
};

export type AppSchema = Database["brincareducando"];
export type AppTable = keyof AppSchema["Tables"];
export type Tables<T extends AppTable> = AppSchema["Tables"][T]["Row"];
export type TablesInsert<T extends AppTable> = AppSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends AppTable> = AppSchema["Tables"][T]["Update"];
