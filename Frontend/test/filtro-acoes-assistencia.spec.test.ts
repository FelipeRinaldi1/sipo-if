// Testes de spec da feature filtro-acoes-assistencia
import { test } from 'node:test';
import assert from 'node:assert/strict';

interface Acao {
  codigoAcao: string;
  nomeAcao: string;
  totalPago: number;
}

function filterAcoes20RL2994(acoes: Acao[]): Acao[] {
  return acoes.filter(a => a.codigoAcao === '20RL' || a.codigoAcao === '2994');
}

// US-011 — Exibição Exclusiva das Ações 20RL e 2994 na Assistência Estudantil
test('AC-018: Filtragem Restrita das Ações 20RL e 2994 @spec:AC-018', () => {
  const acoes: Acao[] = [
    { codigoAcao: '2994', nomeAcao: 'Assistência aos Estudantes', totalPago: 300000 },
    { codigoAcao: '20RL', nomeAcao: 'Funcionamento das Instituições', totalPago: 700000 },
    { codigoAcao: '2000', nomeAcao: 'Outra Ação genérica', totalPago: 50000 },
  ];

  const filtradas = filterAcoes20RL2994(acoes);

  assert.equal(filtradas.length, 2);
  assert.ok(filtradas.some(a => a.codigoAcao === '2994'));
  assert.ok(filtradas.some(a => a.codigoAcao === '20RL'));
  assert.ok(!filtradas.some(a => a.codigoAcao === '2000'));
});
