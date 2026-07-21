import assert from "node:assert/strict";
import test from "node:test";
import { resolveActiveChild } from "../lib/children/resolve-active-child.ts";

const children = [{ id: "ana" }, { id: "bia" }];

test("seleciona automaticamente apenas quando há uma criança", () => {
  const result = resolveActiveChild([{ id: "unica" }]);
  assert.equal(result.activeChild?.id, "unica");
  assert.equal(result.needsSelection, false);
});

test("exige escolha explícita quando há mais de uma criança", () => {
  const result = resolveActiveChild(children);
  assert.equal(result.activeChild, null);
  assert.equal(result.needsSelection, true);
});

test("aceita somente uma escolha existente", () => {
  assert.equal(resolveActiveChild(children, "bia").activeChild?.id, "bia");
  assert.equal(resolveActiveChild(children, "outra").activeChild, null);
  assert.equal(resolveActiveChild(children, "outra").needsSelection, true);
});

