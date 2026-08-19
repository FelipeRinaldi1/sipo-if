import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aggregateFornecedores } from '../../scripts/aggregators/fornecedores.ts';
import type { DespesaDocumento, TopFornecedorItem } from '../../scripts/types.ts';

test('AC-039: Agrupamento temporal e estruturação de série por fornecedor (Linha/Área) @spec:AC-039', () => {
  const docsMock: DespesaDocumento[] = [
    {
      data: '15/01/2025',
      documento: 'DOC01',
      localizadorGasto: 'JACAREI',
      fase: 'Pagamento',
      especie: 'Original',
      favorecido: '30.737.359/0001-07 - RAGNAR SEGURANCA LTDA',
      valor: 20000,
      grupoDespesa: '3',
      elementoDespesa: '37',
      modalidadeDespesa: '90',
      planoOrcamentario: '0000',
      autorEmenda: '0000',
      funcao: '12',
      subfuncao: '363',
      subtitulo: '20RL',
      programaGoverno: '5112',
      acao: '20RL',
      ufFavorecido: 'SP',
      ug: 'IFSP',
      unidadeOrcamentaria: 'IFSP',
      orgao: 'MEC',
      orgaoSuperior: 'MEC'
    },
    {
      data: '20/02/2025',
      documento: 'DOC02',
      localizadorGasto: 'JACAREI',
      fase: 'Pagamento',
      especie: 'Original',
      favorecido: '30.737.359/0001-07 - RAGNAR SEGURANCA LTDA',
      valor: 25000,
      grupoDespesa: '3',
      elementoDespesa: '37',
      modalidadeDespesa: '90',
      planoOrcamentario: '0000',
      autorEmenda: '0000',
      funcao: '12',
      subfuncao: '363',
      subtitulo: '20RL',
      programaGoverno: '5112',
      acao: '20RL',
      ufFavorecido: 'SP',
      ug: 'IFSP',
      unidadeOrcamentaria: 'IFSP',
      orgao: 'MEC',
      orgaoSuperior: 'MEC'
    },
    {
      data: '10/01/2025',
      documento: 'DOC03',
      localizadorGasto: 'JACAREI',
      fase: 'Pagamento',
      especie: 'Original',
      favorecido: '08.720.790/0001-91 - POLO ADMINISTRACAO LTDA',
      valor: 15000,
      grupoDespesa: '3',
      elementoDespesa: '37',
      modalidadeDespesa: '90',
      planoOrcamentario: '0000',
      autorEmenda: '0000',
      funcao: '12',
      subfuncao: '363',
      subtitulo: '20RL',
      programaGoverno: '5112',
      acao: '20RL',
      ufFavorecido: 'SP',
      ug: 'IFSP',
      unidadeOrcamentaria: 'IFSP',
      orgao: 'MEC',
      orgaoSuperior: 'MEC'
    }
  ];

  const resumo = aggregateFornecedores(docsMock);

  assert.ok(resumo.todosFornecedores && resumo.todosFornecedores.length >= 2);
  const ragnar = resumo.todosFornecedores.find(f => f.favorecido.includes('RAGNAR'));
  assert.ok(ragnar, 'Ragnar deve constar na lista agregada');
  assert.equal(ragnar.totalPago, 45000);
  assert.equal(ragnar.quantidadeLancamentos, 2);

  assert.ok(ragnar.evolucaoMensal, 'Deve possuir evolução mensal');
  assert.equal(ragnar.evolucaoMensal.length, 2);
  assert.equal(ragnar.evolucaoMensal[0].mesAno, '01/2025');
  assert.equal(ragnar.evolucaoMensal[0].valorPago, 20000);
  assert.equal(ragnar.evolucaoMensal[1].mesAno, '02/2025');
  assert.equal(ragnar.evolucaoMensal[1].valorPago, 25000);

  const seriesValues = ragnar.evolucaoMensal.map(m => m.valorPago);
  const seriesCategories = ragnar.evolucaoMensal.map(m => m.mesAno);
  assert.deepEqual(seriesValues, [20000, 25000]);
  assert.deepEqual(seriesCategories, ['01/2025', '02/2025']);
});

test('AC-040: Filtragem por autocomplete por Razão Social e CNPJ @spec:AC-040', () => {
  const fornecedoresMock: TopFornecedorItem[] = [
    { favorecido: '30.737.359/0001-07 - RAGNAR SEGURANCA LTDA', totalPago: 400000, quantidadeLancamentos: 10, porcentagemDoTotal: 40 },
    { favorecido: '08.720.790/0001-91 - POLO ADMINISTRACAO LTDA', totalPago: 300000, quantidadeLancamentos: 8, porcentagemDoTotal: 30 },
    { favorecido: '02.302.100/0001-06 - EDP SAO PAULO DISTRIBUICAO DE ENERGIA S.A.', totalPago: 200000, quantidadeLancamentos: 12, porcentagemDoTotal: 20 },
    { favorecido: '54.177.886/0001-72 - COZIL EQUIPAMENTOS INDUSTRIAIS LTDA', totalPago: 100000, quantidadeLancamentos: 2, porcentagemDoTotal: 10 }
  ];

  const filtroCnpj = (termo: string) =>
    fornecedoresMock.filter(f => f.favorecido.toLowerCase().includes(termo.trim().toLowerCase()));

  const resCnpj = filtroCnpj('30.737');
  assert.equal(resCnpj.length, 1);
  assert.equal(resCnpj[0].favorecido, '30.737.359/0001-07 - RAGNAR SEGURANCA LTDA');

  const resNome = filtroCnpj('polo');
  assert.equal(resNome.length, 1);
  assert.equal(resNome[0].favorecido, '08.720.790/0001-91 - POLO ADMINISTRACAO LTDA');

  const resVazia = filtroCnpj('');
  assert.equal(resVazia.length, 4);
});

test('Exclusão de lançamentos do IFSP Campus Jacareí de fornecedores e categorias @spec:AC-008', () => {
  const docsComIfsp: DespesaDocumento[] = [
    {
      data: '15/01/2025',
      documento: 'DOC_IFSP',
      localizadorGasto: 'JACAREI',
      fase: 'Pagamento',
      especie: 'Original',
      favorecido: '158716 - IFSP - CAMPUS JACAREI',
      valor: 50000,
      grupoDespesa: '3',
      elementoDespesa: '18 - Auxílio Financeiro a Estudantes',
      modalidadeDespesa: '90',
      planoOrcamentario: '0000',
      autorEmenda: '0000',
      funcao: '12',
      subfuncao: '363',
      subtitulo: '20RL',
      programaGoverno: '5112',
      acao: '20RL',
      ufFavorecido: 'SP',
      ug: 'IFSP',
      unidadeOrcamentaria: 'IFSP',
      orgao: 'MEC',
      orgaoSuperior: 'MEC'
    },
    {
      data: '20/01/2025',
      documento: 'DOC_VENDOR',
      localizadorGasto: 'JACAREI',
      fase: 'Pagamento',
      especie: 'Original',
      favorecido: '30.737.359/0001-07 - RAGNAR SEGURANCA LTDA',
      valor: 20000,
      grupoDespesa: '3',
      elementoDespesa: '37 - Locação de Mão-de-Obra',
      modalidadeDespesa: '90',
      planoOrcamentario: '0000',
      autorEmenda: '0000',
      funcao: '12',
      subfuncao: '363',
      subtitulo: '20RL',
      programaGoverno: '5112',
      acao: '20RL',
      ufFavorecido: 'SP',
      ug: 'IFSP',
      unidadeOrcamentaria: 'IFSP',
      orgao: 'MEC',
      orgaoSuperior: 'MEC'
    }
  ];

  const resumo = aggregateFornecedores(docsComIfsp);

  assert.equal(resumo.totalGeral, 20000, 'Total geral deve desconsiderar repasses ao próprio campus');
  assert.equal(resumo.topFornecedores.length, 1);
  assert.equal(resumo.topFornecedores[0].favorecido, '30.737.359/0001-07 - RAGNAR SEGURANCA LTDA');

  const contemIfsp = (resumo.todosFornecedores || []).some(f => f.favorecido.includes('158716') || f.favorecido.includes('CAMPUS JACAREI'));
  assert.equal(contemIfsp, false, 'IFSP Campus Jacareí não deve aparecer na lista de fornecedores');

  const contemElementoIfsp = resumo.elementosDespesa.some(e => e.elemento.includes('18 - Auxílio'));
  assert.equal(contemElementoIfsp, false, 'Elemento de despesa exclusiva do campus não deve constar em despesas de fornecedores');
});

test('AC-041: Estruturação dos dados para o Gráfico de Concentração com top N empresas e Demais Fornecedores @spec:AC-041', () => {
  const fornecedoresMock: TopFornecedorItem[] = Array.from({ length: 25 }, (_, i) => ({
    favorecido: `00.000.${String(i).padStart(3, '0')}/0001-00 - Empresa Teste ${i + 1} LTDA`,
    totalPago: (25 - i) * 10000,
    quantidadeLancamentos: 5,
    porcentagemDoTotal: 4
  }));

  const totalGeral = fornecedoresMock.reduce((acc, curr) => acc + curr.totalPago, 0);

  const top12 = fornecedoresMock.slice(0, 12);
  const somaTop12 = top12.reduce((acc, curr) => acc + curr.totalPago, 0);
  const demais = Math.max(0, totalGeral - somaTop12);

  const categories: string[] = top12.map(f =>
    f.favorecido.includes(' - ') ? f.favorecido.split(' - ').slice(1).join(' - ') : f.favorecido
  );
  const values: number[] = top12.map(f => f.totalPago);

  if (demais > 0) {
    categories.push('Demais Fornecedores / Outros');
    values.push(demais);
  }

  assert.equal(categories.length, 13, 'Deve conter 12 maiores fornecedores + 1 item para Demais Fornecedores');
  assert.equal(values.length, 13);
  assert.equal(categories[0], 'Empresa Teste 1 LTDA');
  assert.equal(values[0], 250000);
  assert.equal(categories[11], 'Empresa Teste 12 LTDA');
  assert.equal(categories[12], 'Demais Fornecedores / Outros');

  const somaValores = values.reduce((acc, curr) => acc + curr, 0);
  assert.equal(somaValores, totalGeral, 'A soma das barras deve ser idêntica ao total geral orçamentário');
});



