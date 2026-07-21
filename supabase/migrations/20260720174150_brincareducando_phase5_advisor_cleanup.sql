-- Keep Brincontos private to the authenticated product surface and remove a redundant index.
begin;
revoke all privileges on table brincareducando.historias_prompts, brincareducando.historias_extensoes, brincareducando.historias_fontes, brincareducando.historias_sessoes from anon, public;
grant select, insert, update, delete on table brincareducando.historias_prompts, brincareducando.historias_extensoes, brincareducando.historias_fontes, brincareducando.historias_sessoes to authenticated;
alter table brincareducando.historias_textos drop constraint if exists historias_textos_ordem_unica;
commit;
