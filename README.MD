# FinanceVision

## Descrição Geral

FinanceVision é um aplicativo web de gerenciamento financeiro pessoal que permite aos usuários inserir seus gastos e
lucros, organizando suas finanças de maneira centralizada. Utilizando ReactJS para a interface, JavaScript puro para
funcionalidades adicionais, SCSS para estilização e Firebase para armazenamento de dados, o aplicativo também incorpora
inteligência artificial para fornecer insights financeiros personalizados e sugestões para economizar.

## Componentes Principais

### Interface do Usuário com React:

- **Dashboard Principal**: Um painel central que exibe um resumo das finanças do usuário, incluindo gráficos de
  despesas, receitas e saldo atual.
- **Formulários de Inserção de Dados**: Formulários intuitivos para adicionar novos gastos e receitas, categorizados por
  tipo (alimentação, transporte, lazer, etc.).
- **Visão Mensal e Anual**: Visualizações que permitem aos usuários ver seus dados financeiros mensais e anuais.
- **Notificações e Alertas**: Sistema de notificações para alertar sobre gastos excessivos ou quando os usuários estão
  próximos de seus limites orçamentários.

### Coleta e Armazenamento de Dados com Firebase:

- **Autenticação de Usuários**: Utilização do Firebase Authentication para registrar e autenticar usuários.
- **Banco de Dados em Tempo Real**: Uso do Firebase Firestore para armazenar e sincronizar dados financeiros dos
  usuários em tempo real.
- **Backup e Recuperação**: Funcionalidades para backup automático e recuperação de dados.

### Análise e Sugestões com IA:

- **Classificação Automática de Transações**: Algoritmos de machine learning para classificar automaticamente as
  transações em categorias apropriadas com base em padrões de gastos anteriores.
- **Previsões de Despesas**: Modelos de aprendizado de máquina para prever futuras despesas com base em históricos de
  gastos.
- **Sugestões de Economia**: IA para analisar os padrões de gastos e fornecer sugestões personalizadas para economizar
  dinheiro.
- **Análise de Tendências**: Ferramentas para identificar tendências de gastos e receitas ao longo do tempo.

### Visualização de Dados:

- **Gráficos e Tabelas Interativos**: Utilização de bibliotecas de visualização como Chart.js para criar gráficos de
  barras, linhas e torta que ajudam os usuários a entender melhor suas finanças.
- **Resumo Financeiro**: Resumos visuais que mostram a distribuição de gastos por categoria e a evolução das finanças ao
  longo do tempo.

## Funcionalidades Adicionais

- **Orçamento e Metas Financeiras**: Permite que os usuários estabeleçam orçamentos mensais e metas financeiras,
  monitorando seu progresso ao longo do tempo.
- **Exportação de Dados**: Opções para exportar dados financeiros em formatos como CSV ou PDF para análises externas ou
  para compartilhar com consultores financeiros.
- **Integração com Contas Bancárias**: Futuramente, pode-se considerar a integração com APIs de bancos para importar
  transações automaticamente (por exemplo, Open Banking).

## Tecnologias Utilizadas

- **Frontend**:
  - Ionic Framework com ReactJS para construir a interface de usuário interativa.
  - JavaScript Puro para funcionalidades adicionais e manipulações diretas do DOM.
  - SCSS / Bootstrap para estilização avançada e responsiva do aplicativo.
- **Backend / Firebase**:
  - Firebase Authentication para autenticação de usuários.
  - Firebase Realtime Database / Firestore Database para armazenamento de dados em tempo real.
- **Machine Learning**:
  - TensorFlow.js ou Brain.js para implementar modelos de aprendizado de máquina diretamente no frontend.
  - APIs de Análise de Dados, como a Google AI ou outras APIs para fornecer capacidades avançadas de IA.

## Benefícios

- **Organização Financeira Centralizada**: Todos os dados financeiros do usuário em um único lugar, com fácil acesso e
  gerenciamento.
- **Insights Personalizados**: IA fornece sugestões e previsões que ajudam os usuários a gerenciar melhor suas finanças.
- **Economia de Tempo**: Automatização de categorização de transações e análise de dados, economizando tempo dos
  usuários.
- **Acompanhamento de Metas**: Ajuda os usuários a monitorar e alcançar suas metas financeiras com mais eficiência.

## Exemplo de Uso da IA

- **Sugestões de Economia Personalizadas**: A IA pode analisar os padrões de gastos do usuário e sugerir mudanças
  específicas para economizar, como reduzir gastos em categorias onde há desperdício ou negociar melhores tarifas em
  serviços recorrentes.
- **Detecção de Anomalias**: Identificar e alertar o usuário sobre transações incomuns ou fora do padrão, ajudando na
  detecção de possíveis fraudes.

Esse aplicativo oferece uma solução completa para gerenciamento financeiro pessoal, combinando tecnologias modernas e
inteligência artificial para melhorar a experiência do usuário e ajudar na tomada de decisões financeiras mais
informadas.

---

Criado por Victor Maciel Oliveira
