export interface DespesaPorOrgao {
  mesAno: string;
  orgaoSuperior: string;
  orgaoEntidadeVinculada: string;
  unidadeGestora: string;
  valorEmpenhado: number;
  valorLiquidado: number;
  valorPago: number;
  valorRestosAPagarPagos: number;
}

export interface DespesaPorProgramaAcao {
  mesAno: string;
  programaOrcamentario: string;
  acaoOrcamentaria: string;
  unidadeGestora: string;
  valorEmpenhado: number;
  valorLiquidado: number;
  valorPago: number;
  valorRestosAPagarPagos: number;
}

export interface DespesaDocumento {
  data: string;
  documento: string;
  localizadorGasto: string;
  fase: string;
  especie: string;
  favorecido: string;
  ufFavorecido: string;
  ug: string;
  unidadeOrcamentaria: string;
  orgao: string;
  orgaoSuperior: string;
  valor: number;
  grupoDespesa: string;
  elementoDespesa: string;
  modalidadeDespesa: string;
  planoOrcamentario: string;
  autorEmenda: string;
  funcao: string;
  subfuncao: string;
  subtitulo: string;
  programaGoverno: string;
  acao: string;
}

export interface EvolucaoMensalItem {
  mesAno: string;
  empenhado: number;
  liquidado: number;
  pago: number;
  restosAPagarPagos: number;
}

export interface ResumoExecucao {
  totalEmpenhado: number;
  totalLiquidado: number;
  totalPago: number;
  totalRestosAPagarPagos: number;
  evolucaoMensal: EvolucaoMensalItem[];
}

export interface ItemAcaoResumo {
  codigoAcao: string;
  nomeAcao: string;
  totalEmpenhado: number;
  totalLiquidado: number;
  totalPago: number;
  porcentagemDoTotal: number;
}

export interface EvolucaoAcaoItem {
  codigoAcao: string;
  mesAno: string;
  valorEmpenhado: number;
  valorLiquidado: number;
  valorPago: number;
}

export interface ResumoProgramaAcao {
  totalGeralEmpenhado: number;
  totalGeralPago: number;
  acoes: ItemAcaoResumo[];
  evolucaoAssistenciaMensal: EvolucaoAcaoItem[];
}

export interface EvolucaoMensalFornecedorItem {
  mesAno: string;
  valorPago: number;
  quantidadeLancamentos: number;
}

export interface TopFornecedorItem {
  favorecido: string;
  totalPago: number;
  quantidadeLancamentos: number;
  porcentagemDoTotal: number;
  evolucaoMensal?: EvolucaoMensalFornecedorItem[];
}

export interface ElementoDespesaItem {
  elemento: string;
  totalPago: number;
  quantidadeLancamentos: number;
  porcentagemDoTotal: number;
}

export interface ResumoFornecedores {
  totalGeral: number;
  topFornecedores: TopFornecedorItem[];
  todosFornecedores?: TopFornecedorItem[];
  elementosDespesa: ElementoDespesaItem[];
}

export interface DocumentosJson {
  total: number;
  itens: DespesaDocumento[];
}
