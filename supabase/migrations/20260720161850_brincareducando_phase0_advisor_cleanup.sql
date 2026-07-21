-- Phase 0 follow-up: remove the only duplicate index reported by the
-- performance advisor and run the read-only access wrapper as its caller.

drop index if exists brincareducando.diario_entradas_usuario_data_idx;

alter function brincareducando.current_user_has_manylabs_app_access()
  security invoker;
