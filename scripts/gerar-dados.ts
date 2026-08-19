import fs from 'node:fs';
import path from 'node:path';
import type { DespesaPorOrgao, DespesaPorProgramaAcao, DespesaDocumento } from './types.ts';
import { aggregateDashboard } from './aggregators/dashboard.ts';
import { aggregateProgramaAcao } from './aggregators/programa-acao.ts';
import { aggregateFornecedores } from './aggregators/fornecedores.ts';
import { aggregateDocumentos } from './aggregators/documentos.ts';

function cleanCols(cols: string[]): string[] {
  return cols.map(c => c.trim().replace(/^["']|["']$/g, ''));
}

function parseDecimal(rawVal: string): number {
  if (!rawVal || !rawVal.trim()) return 0;
  const cleaned = rawVal.trim().replace(/\./g, '').replace(',', '.');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

export function parseDespesasPorOrgao(csvContent: string): DespesaPorOrgao[] {
  const lines = csvContent.split(/\r?\n/);
  const result: DespesaPorOrgao[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = cleanCols(line.split(';'));
    if (cols.length < 8) continue;

    result.push({
      mesAno: cols[0],
      orgaoSuperior: cols[1],
      orgaoEntidadeVinculada: cols[2],
      unidadeGestora: cols[3],
      valorEmpenhado: parseDecimal(cols[4]),
      valorLiquidado: parseDecimal(cols[5]),
      valorPago: parseDecimal(cols[6]),
      valorRestosAPagarPagos: parseDecimal(cols[7])
    });
  }
  return result;
}

export function parseDespesasPorProgramaAcao(csvContent: string): DespesaPorProgramaAcao[] {
  const lines = csvContent.split(/\r?\n/);
  const result: DespesaPorProgramaAcao[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = cleanCols(line.split(';'));
    if (cols.length < 7) continue;

    result.push({
      mesAno: cols[0],
      programaOrcamentario: cols[1],
      acaoOrcamentaria: cols[2],
      unidadeGestora: cols[3],
      valorEmpenhado: parseDecimal(cols[4]),
      valorLiquidado: parseDecimal(cols[5]),
      valorPago: parseDecimal(cols[6]),
      valorRestosAPagarPagos: cols.length > 7 ? parseDecimal(cols[7]) : 0
    });
  }
  return result;
}

export function parseDespesasDocumento(csvContent: string): DespesaDocumento[] {
  const lines = csvContent.split(/\r?\n/);
  const result: DespesaDocumento[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = cleanCols(line.split(';'));
    if (cols.length < 22) continue;

    result.push({
      data: cols[0],
      documento: cols[1],
      localizadorGasto: cols[2],
      fase: cols[3],
      especie: cols[4],
      favorecido: cols[5],
      ufFavorecido: cols[6],
      ug: cols[7],
      unidadeOrcamentaria: cols[8],
      orgao: cols[9],
      orgaoSuperior: cols[10],
      valor: parseDecimal(cols[11]),
      grupoDespesa: cols[12],
      elementoDespesa: cols[13],
      modalidadeDespesa: cols[14],
      planoOrcamentario: cols[15],
      autorEmenda: cols[16],
      funcao: cols[17],
      subfuncao: cols[18],
      subtitulo: cols[19],
      programaGoverno: cols[20],
      acao: cols[21]
    });
  }
  return result;
}

function findCsvFilesForYear(baseDownloads: string, anoStr: string): {
  orgaoFile?: string;
  programaFile?: string;
  documentosFile?: string;
} {
  const candidatesOrgao = [
    path.join(baseDownloads, 'despesasPorOrgao', `despesasPorOrgao${anoStr}.csv`),
    path.join(baseDownloads, 'despesasPorOrgao', 'despesasPorOrgao.csv'),
    path.join(baseDownloads, anoStr, 'despesasPorOrgao.csv'),
    path.join(baseDownloads, anoStr, `despesasPorOrgao${anoStr}.csv`),
    path.join(baseDownloads, `despesasPorOrgao${anoStr}.csv`),
    path.join(baseDownloads, 'despesasPorOrgao.csv')
  ];
  const candidatesPrograma = [
    path.join(baseDownloads, 'despesasPorProgramaAcao', `despesasPorProgramaAcao${anoStr}.csv`),
    path.join(baseDownloads, 'despesasPorProgramaAcao', 'despesasPorProgramaAcao.csv'),
    path.join(baseDownloads, anoStr, 'despesasPorProgramaAcao.csv'),
    path.join(baseDownloads, anoStr, `despesasPorProgramaAcao${anoStr}.csv`),
    path.join(baseDownloads, `despesasPorProgramaAcao${anoStr}.csv`),
    path.join(baseDownloads, 'despesasPorProgramaAcao.csv')
  ];
  const candidatesDocs = [
    path.join(baseDownloads, 'documentos', `documentos${anoStr}.csv`),
    path.join(baseDownloads, 'documentos', 'documentos.csv'),
    path.join(baseDownloads, anoStr, 'documentos.csv'),
    path.join(baseDownloads, anoStr, `documentos${anoStr}.csv`),
    path.join(baseDownloads, `documentos${anoStr}.csv`),
    path.join(baseDownloads, 'documentos.csv')
  ];

  const orgaoFile = candidatesOrgao.find(f => fs.existsSync(f));
  const programaFile = candidatesPrograma.find(f => fs.existsSync(f));
  const documentosFile = candidatesDocs.find(f => fs.existsSync(f));

  return { orgaoFile, programaFile, documentosFile };
}

function discoverAvailableYears(baseDownloads: string): string[] {
  const anosSet = new Set<string>();

  if (fs.existsSync(baseDownloads)) {
    const entries = fs.readdirSync(baseDownloads, { withFileTypes: true });

    for (const d of entries) {
      if (d.isDirectory() && /^\d{4}$/.test(d.name)) {
        anosSet.add(d.name);
      }
    }

    const subdirs = ['despesasPorOrgao', 'despesasPorProgramaAcao', 'documentos'];
    for (const subdir of subdirs) {
      const subdirPath = path.join(baseDownloads, subdir);
      if (fs.existsSync(subdirPath) && fs.statSync(subdirPath).isDirectory()) {
        const files = fs.readdirSync(subdirPath);
        for (const file of files) {
          const match = file.match(/(\d{4})\.csv$/);
          if (match) {
            anosSet.add(match[1]);
          }
        }
      }
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        const match = entry.name.match(/(\d{4})\.csv$/);
        if (match) {
          anosSet.add(match[1]);
        }
      }
    }
  }

  const anosValidos = Array.from(anosSet)
    .filter(ano => {
      const { orgaoFile, programaFile, documentosFile } = findCsvFilesForYear(baseDownloads, ano);
      return Boolean(orgaoFile && programaFile && documentosFile);
    })
    .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

  return anosValidos;
}

export function gerarDados(ano?: string, downloadsDir?: string, outputDir?: string) {
  const baseDownloads = downloadsDir || path.resolve(process.cwd(), 'downloads');
  const baseOutput = outputDir || path.resolve(process.cwd(), 'frontend', 'src', 'assets', 'data');

  if (!fs.existsSync(baseDownloads)) {
    throw new Error(`Erro: Diretório de downloads não encontrado: ${baseDownloads}`);
  }

  const anosDisponiveis = discoverAvailableYears(baseDownloads);
  const anosValidos: string[] = [];
  const todosOrgao: DespesaPorOrgao[] = [];
  const todosPrograma: DespesaPorProgramaAcao[] = [];
  const todosDocs: DespesaDocumento[] = [];

  const anosParaProcessar = ano ? [ano] : anosDisponiveis;

  if (ano && !anosDisponiveis.includes(ano)) {
    const { orgaoFile, programaFile, documentosFile } = findCsvFilesForYear(baseDownloads, ano);
    if (!orgaoFile || !programaFile || !documentosFile) {
      throw new Error(`Erro: Arquivos CSV ausentes para o ano ${ano} em ${baseDownloads}`);
    }
  }

  for (const anoDir of anosParaProcessar) {
    const { orgaoFile, programaFile, documentosFile } = findCsvFilesForYear(baseDownloads, anoDir);

    if (orgaoFile && programaFile && documentosFile) {
      anosValidos.push(anoDir);

      const targetDir = path.join(baseOutput, anoDir);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const orgaoContent = fs.readFileSync(orgaoFile, 'utf8');
      const registrosOrgao = parseDespesasPorOrgao(orgaoContent);
      todosOrgao.push(...registrosOrgao);
      const resumoExecucao = aggregateDashboard(registrosOrgao);
      fs.writeFileSync(path.join(targetDir, 'resumo-execucao.json'), JSON.stringify(resumoExecucao, null, 2), 'utf8');

      const programaContent = fs.readFileSync(programaFile, 'utf8');
      const registrosPrograma = parseDespesasPorProgramaAcao(programaContent);
      todosPrograma.push(...registrosPrograma);
      const resumoProgramaAcao = aggregateProgramaAcao(registrosPrograma);
      fs.writeFileSync(path.join(targetDir, 'programa-acao.json'), JSON.stringify(resumoProgramaAcao, null, 2), 'utf8');

      const documentosContent = fs.readFileSync(documentosFile, 'utf8');
      const registrosDocs = parseDespesasDocumento(documentosContent);
      todosDocs.push(...registrosDocs);
      const resumoFornecedores = aggregateFornecedores(registrosDocs);
      fs.writeFileSync(path.join(targetDir, 'fornecedores.json'), JSON.stringify(resumoFornecedores, null, 2), 'utf8');

      const documentosJson = aggregateDocumentos(registrosDocs);
      fs.writeFileSync(path.join(targetDir, 'documentos.json'), JSON.stringify(documentosJson, null, 2), 'utf8');

      if (anoDir === '2025' || (!ano && anoDir === anosValidos[0])) {
        fs.writeFileSync(path.join(baseOutput, 'resumo-execucao.json'), JSON.stringify(resumoExecucao, null, 2), 'utf8');
        fs.writeFileSync(path.join(baseOutput, 'programa-acao.json'), JSON.stringify(resumoProgramaAcao, null, 2), 'utf8');
        fs.writeFileSync(path.join(baseOutput, 'fornecedores.json'), JSON.stringify(resumoFornecedores, null, 2), 'utf8');
        fs.writeFileSync(path.join(baseOutput, 'documentos.json'), JSON.stringify(documentosJson, null, 2), 'utf8');
      }

      console.log(`✔ Dados de ${anoDir} gerados em ${targetDir}`);
    } else if (ano) {
      throw new Error(`Erro: Arquivos CSV ausentes para o ano ${anoDir} em ${baseDownloads}`);
    }
  }

  if (todosOrgao.length > 0) {
    const todosDir = path.join(baseOutput, 'todos');
    if (!fs.existsSync(todosDir)) {
      fs.mkdirSync(todosDir, { recursive: true });
    }

    const resumoTodos = aggregateDashboard(todosOrgao);
    fs.writeFileSync(path.join(todosDir, 'resumo-execucao.json'), JSON.stringify(resumoTodos, null, 2), 'utf8');

    const programaTodos = aggregateProgramaAcao(todosPrograma);
    fs.writeFileSync(path.join(todosDir, 'programa-acao.json'), JSON.stringify(programaTodos, null, 2), 'utf8');

    const fornecedoresTodos = aggregateFornecedores(todosDocs);
    fs.writeFileSync(path.join(todosDir, 'fornecedores.json'), JSON.stringify(fornecedoresTodos, null, 2), 'utf8');

    const docsTodos = aggregateDocumentos(todosDocs);
    fs.writeFileSync(path.join(todosDir, 'documentos.json'), JSON.stringify(docsTodos, null, 2), 'utf8');

    console.log(`✔ Dados consolidados gerados em ${todosDir}`);
  }

  const listaAnos = ['todos', ...anosValidos];
  fs.writeFileSync(path.join(baseOutput, 'anos.json'), JSON.stringify(listaAnos, null, 2), 'utf8');
  console.log(`✔ anos.json gerado: ${JSON.stringify(listaAnos)}`);
}

const isMainModule = process.argv[1]?.endsWith('gerar-dados.ts') && !process.argv.some(a => a.includes('.spec.test.ts'));
if (isMainModule) {
  const args = process.argv.slice(2);
  let ano: string | undefined;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--ano' && args[i + 1]) {
      ano = args[i + 1];
      i++;
    }
  }

  try {
    gerarDados(ano);
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
}
