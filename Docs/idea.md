# SIPO-IF — Sistema Integrado de Planejamento e Orçamento

### Instituto Federal de São Paulo — Campus Jacareí

---

## O Problema

O orçamento público do IFSP Campus Jacareí é gerenciado por meio de
planilhas manuais, dados dispersos no Portal da Transparência e processos internos
sem rastreabilidade consolidada. Isso gera três problemas centrais:

1. **Falta de transparência real**: os dados existem publicamente, mas são inacessíveis
   para quem não conhece o SIAFI ou o Portal da Transparência.
2. **Gestão reativa**: sem visibilidade contínua do orçamento, decisões de alocação
   interna são tomadas tarde ou com informação incompleta.
3. **Retrabalho operacional**: a equipe da DAA/CCF replica manualmente dados entre
   sistemas e planilhas para gerar relatórios ao Conselho de Campus.

---

## A Solução

O **SIPO-IF** é uma aplicação web que resolve os três problemas ao mesmo tempo:

- **Para a comunidade**: um portal público com dashboard visual e interativo sobre
  como o dinheiro do campus está sendo gasto — sem necessidade de login ou conhecimento
  técnico em orçamento público.
- **Para a gestão interna**: um painel administrativo onde a DAA/CCF distribui o
  orçamento em projetos e setores, registra consumo de utilidades e gera relatórios
  prontos para o Conselho de Campus.
- **Para a operação**: sincronização automática com a API do Portal da Transparência,
  eliminando a coleta manual de dados.

---

## Módulos

### 🌐 Módulo 1 — Painel Público (Transparência)

> Acesso aberto, sem autenticação. Voltado a alunos, servidores e comunidade externa.

- Dashboard com os totais anuais: **Orçamento Aprovado → Empenhado → Liquidado → Pago**
- Gráfico de proporção **Custeio vs. Capital**
- Filtros por **Ano**, **Mês** e **Natureza da Despesa**
- Glossário interativo com explicações de termos técnicos (tooltip ao passar o mouse)
- Interface 100% responsiva e acessível (eMAG / WCAG 2.1)

### 🔐 Módulo 2 — Painel Interno (Administrativo)

> Acesso autenticado. Voltado à equipe DAA/CCF e Gestão do Campus.

**Perfil Administrador (DAA/CCF)**

- Cadastro e redistribuição da **Matriz de Alocação Interna** por setor/projeto
- Registro mensal de consumo de **utilidades**: Água, Energia, Telefonia, Internet,
  Limpeza, Vigilância
- Upload de planilhas para atualização em lote do planejamento
- Exportação de dados em Excel

**Perfil Gestão do Campus**

- Visualização de relatórios gerenciais e comparativos de metas
- Exportação de relatórios em **PDF** e **Excel** formatados para o Conselho de Campus

### 🔄 Módulo 3 — Integração com Portal da Transparência

> Transparência automatizada, sem dependência de atualização manual.

- Sincronização agendada com a **API do Portal da Transparência do Governo Federal**,
  filtrando pela UG `158716` (Campus Jacareí)
- Persistência local de todos os dados consumidos (cache em banco PostgreSQL)
- Garantia de disponibilidade mesmo em caso de instabilidade da API governamental

---

## Stack Técnica

| Camada                  | Tecnologia                                         |
| ----------------------- | -------------------------------------------------- |
| **Backend**             | C# / .NET 10 — Minimal APIs, Entity Framework Core |
| **Banco de Dados**      | PostgreSQL                                         |
| **Frontend**            | Angular 22 + Angular Material + Tailwind CSS v4    |
| **Autenticação**        | ASP.NET Core Identity + JWT                        |
| **Documentação da API** | Scalar (OpenAPI)                                   |
| **Infraestrutura**      | Docker Compose                                     |

### Decisões de Design

- **Vertical Slice Architecture** no backend: cada módulo de negócio é uma fatia
  independente em `Features/<Modulo>/`, reduzindo acoplamento e facilitando evolução.
- **Dados públicos persistidos localmente**: a API governamental pode ter instabilidade
  e rate limits; armazenar localmente garante performance e disponibilidade.
- **Dois públicos, um sistema**: o frontend serve o portal público sem autenticação
  e o painel interno com guard de rotas — mesma base de código, experiências distintas.
- **LGPD by design**: o sistema não coleta dados pessoais de alunos no módulo público;
  os dados gerenciados internamente são de natureza orçamentária, não pessoal.

---

## Cronograma Sugerido (Fases)

```
Fase 1 — MVP Público
  ├── Integração com API do Portal da Transparência (RF10 + RF11)
  ├── Dashboard público com indicadores (RF01, RF02, RF03)
  └── Glossário interativo (RF04)

Fase 2 — Painel Administrativo
  ├── Autenticação e perfis (RF05)
  ├── Matriz de Alocação Interna (RF06)
  └── Gestão de Utilidades (RF07)

Fase 3 — Produtividade e Relatórios
  ├── Importador/Exportador de Planilhas (RF08)
  └── Relatórios PDF/Excel para o Conselho (RF09)
```

---

## Pautas em Aberto

> Itens a definir na reunião com a gestão do campus:

- **Prioridade de entrega**: lançar primeiro o painel público (transparência) ou o
  painel interno (gestão)?
- **Dados históricos**: a partir de qual ano importar os dados orçamentários?
- **Fluxo de aprovação**: lançamentos internos da DAA precisam de aprovação antes de
  ficarem visíveis no portal público?
- **Formato de planilhas**: qual o formato esperado para o importador — XLSX do SIAFI,
  modelo próprio do campus ou livre?

---

## Impacto Esperado

| Stakeholder         | Ganho                                                        |
| ------------------- | ------------------------------------------------------------ |
| Alunos e comunidade | Acesso simples e visual ao uso do dinheiro público do campus |
| DAA / CCF           | Fim do retrabalho manual; relatórios gerados em segundos     |
| Gestão do Campus    | Visibilidade em tempo real para tomada de decisão            |
| Conselho de Campus  | Relatórios padronizados e rastreáveis                        |
| Sociedade           | Transparência pública ativa, não apenas passiva              |
