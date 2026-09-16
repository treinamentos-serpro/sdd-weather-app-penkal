# Discovery de Requisitos — Aplicação de Previsão do Tempo

## Contexto

A empresa deseja disponibilizar uma aplicação de previsão do tempo para que
usuários consultem rapidamente as condições meteorológicas de uma cidade. A
experiência principal consiste em buscar uma cidade, visualizar o clima atual e
consultar uma previsão para os próximos cinco dias.

O produto deve atender tanto a usuários que precisam de uma decisão imediata,
como escolher uma roupa ou decidir se precisam levar um guarda-chuva, quanto a
usuários que planejam atividades nos dias seguintes. Como o uso em dispositivos
móveis foi explicitamente solicitado, a experiência deve ser pensada com
prioridade para telas pequenas, sem impedir o uso em telas maiores.

## Personas

### 1. Mariana, a planejadora de atividades

- **Objetivo principal:** consultar a previsão dos próximos cinco dias para
  decidir quando realizar atividades ao ar livre, viagens curtas ou compromissos
  familiares.
- **Contexto de uso:** pesquisa inicialmente no desktop, mas também consulta a
  aplicação no celular durante deslocamentos.
- **Métrica de sucesso:** consegue localizar a cidade e interpretar a previsão
  de cinco dias em até dois minutos, sem precisar repetir a busca.

### 2. João, o decisor do dia a dia

- **Objetivo principal:** verificar rapidamente o clima atual antes de sair de
  casa e decidir roupa, transporte ou necessidade de levar um guarda-chuva.
- **Contexto de uso:** uso predominante em mobile, geralmente com pouco tempo e
  conexão móvel.
- **Métrica de sucesso:** obtém a temperatura e a condição atual da cidade em
  até 30 segundos após abrir a aplicação.

### 3. Aisha, a usuária internacional

- **Objetivo principal:** consultar o clima de uma cidade em outro país usando a
  unidade de temperatura com a qual está acostumada.
- **Contexto de uso:** alterna entre mobile e desktop durante viagens; pode
  precisar distinguir cidades com o mesmo nome em países diferentes.
- **Métrica de sucesso:** identifica a cidade correta e visualiza os valores na
  unidade desejada sem confundir localização, data ou temperatura.

## Requisitos Funcionais

- **RF1 — Buscar cidade:** permitir que o usuário informe o nome de uma cidade e
  inicie uma busca.
- **RF2 — Selecionar cidade:** apresentar resultados suficientes para
  diferenciar cidades com o mesmo nome, como país, estado ou região, quando
  aplicável.
- **RF3 — Exibir clima atual:** mostrar as condições atuais da cidade
  selecionada, incluindo ao menos temperatura e uma descrição da condição
  meteorológica.
- **RF4 — Exibir previsão de cinco dias:** apresentar a previsão diária para os
  cinco dias solicitados, com data, temperatura e condição meteorológica.
- **RF5 — Alternar unidade de temperatura:** permitir alternar entre Celsius e
  Fahrenheit.
- **RF6 — Atualizar valores ao trocar a unidade:** refletir a unidade escolhida
  em todos os valores de temperatura exibidos.
- **RF7 — Informar estados da operação:** comunicar ao usuário quando os dados
  estão carregando, quando a busca não encontrou resultados e quando ocorreu um
  erro ao consultar os dados.
- **RF8 — Tentar novamente:** oferecer uma forma de repetir a consulta após uma
  falha recuperável de rede ou de serviço.

## Requisitos Não-Funcionais

- **RNF1 — Responsividade:** a aplicação deve ser utilizável em dispositivos
  móveis e adaptar seu layout a diferentes tamanhos de tela.
- **RNF2 — Usabilidade:** a busca, a seleção da cidade e a alternância de
  unidade devem ser compreensíveis e exigir poucos passos.
- **RNF3 — Acessibilidade:** os controles devem ser operáveis por teclado,
  possuir nomes acessíveis e usar estrutura semântica adequada, com contraste
  suficiente para leitura.
- **RNF4 — Performance:** a interface deve apresentar feedback imediato durante
  buscas e carregar os dados em tempo compatível com uma conexão comum.
- **RNF5 — Disponibilidade e resiliência:** falhas temporárias de rede ou da
  fonte de dados não devem deixar a interface sem explicação ou em estado
  indefinido.
- **RNF6 — Compatibilidade:** a aplicação deve funcionar nos principais
  navegadores modernos em dispositivos móveis e desktop.
- **RNF7 — Privacidade e segurança:** a solução deve evitar coletar dados
  pessoais desnecessários e proteger qualquer comunicação com serviços externos.
- **RNF8 — Internacionalização:** datas, textos e unidades devem ser exibidos de
  forma consistente com o idioma e a localidade definidos para o produto.
- **RNF9 — Manutenibilidade:** a solução deve manter separadas as regras de
  negócio, a integração com serviços externos e a apresentação, permitindo
  evoluir cada parte com baixo impacto nas demais.
- **RNF10 — Testabilidade:** os fluxos principais, as conversões de unidade, os
  estados de carregamento e erro e a adaptação a diferentes telas devem poder
  ser validados por testes automatizados.
- **RNF11 — Consistência de dados:** localização, datas, horários, unidades e
  valores meteorológicos devem ser apresentados de forma consistente em todas
  as áreas da aplicação, respeitando o fuso horário da cidade selecionada.

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| A fonte de dados pode ficar indisponível, lenta ou sujeita a limite de requisições. | Média | Alto | Definir timeout, tratar erros, oferecer nova tentativa e avaliar cache ou fonte alternativa. |
| A busca pode retornar cidades homônimas ou não encontrar o termo digitado. | Alta | Médio | Exibir país/região nos resultados, validar entrada e comunicar claramente ausência de resultados. |
| A previsão pode ser interpretada de forma diferente do esperado, especialmente quanto à inclusão do dia atual. | Média | Alto | Confirmar a regra de contagem dos cinco dias antes da especificação detalhada e exibi-la claramente na interface. |
| A conversão entre Celsius e Fahrenheit pode gerar valores inconsistentes ou arredondamentos inadequados. | Baixa | Médio | Centralizar a conversão em uma função testável e definir precisão e arredondamento. |
| O layout pode ficar difícil de usar em telas pequenas ou em orientações diferentes. | Média | Alto | Adotar abordagem mobile-first e validar em múltiplos tamanhos de viewport e orientação. |
| Conexões móveis instáveis podem interromper consultas ou deixar dados desatualizados. | Média | Médio | Mostrar estados de carregamento e erro, permitir nova tentativa e definir política de atualização dos dados. |

## Perguntas em Aberto

1. **Qual será a fonte de dados meteorológicos?** Ela exige chave de API, possui
   custo, limites de uso ou restrições de distribuição? Isso define arquitetura,
   orçamento e estratégia de disponibilidade.
2. **Os cinco dias incluem o dia atual?** A resposta altera o intervalo exibido,
   os rótulos das datas e a interpretação do requisito principal.
3. **Quais informações, além da temperatura e condição, devem aparecer?**
   Umidade, vento, precipitação e sensação térmica impactam o contrato de dados e
   a densidade da interface.
4. **Como a cidade será escolhida quando houver homônimos?** É necessário definir
   país, estado, coordenadas e o nível de desambiguação mostrado ao usuário.
5. **Qual deve ser a unidade padrão na primeira visita?** A decisão influencia a
   experiência inicial e pode depender da localidade ou da preferência do
   usuário.
6. **A aplicação deve usar geolocalização automática?** Isso muda o fluxo de
   entrada, exige consentimento e introduz dependência de permissões do
   dispositivo.
7. **É necessário salvar a última cidade ou cidades favoritas?** Essa decisão
   determina se haverá persistência local, conta de usuário ou apenas uma sessão
   temporária.
8. **Quais idiomas e localidades serão suportados?** A resposta define
   tradução, formatação de datas e regras de unidade.
9. **Qual é o comportamento esperado quando o usuário estiver offline?** Pode ser
   necessário exibir o último resultado armazenado ou apenas uma mensagem de
   indisponibilidade.
10. **Quais navegadores e versões de dispositivos devem ser suportados?** Isso
    orienta compatibilidade técnica, testes e prioridades de acessibilidade.

## Decisões

- **Fonte de dados: Open-Meteo, sem API key.** A escolha reduz a complexidade de
  configuração e evita o gerenciamento de credenciais no escopo inicial. Resolve
  a pergunta 1 ao definir a fonte, o modelo de integração e a ausência de custo
  de chave de API.
- **Previsão de cinco dias: hoje + quatro dias.** Incluir o dia atual atende à
  necessidade de consulta imediata e mantém o intervalo total em cinco dias.
  Resolve a pergunta 2 ao fixar o período e os rótulos das datas exibidas.
- **Unidade padrão: Celsius.** Celsius será usado na primeira visita, com
  alternância para Fahrenheit disponível conforme o requisito funcional.
  Resolve a pergunta 5 ao definir um comportamento inicial consistente,
  independente da localidade do navegador.
- **Sem autenticação e sem persistência de servidor.** A experiência será
  anônima e os dados consultados não serão associados a uma conta nem salvos no
  servidor. Resolve a pergunta 7 ao limitar o escopo a uma sessão, sem última
  cidade ou favoritos persistidos, e confirma que autenticação não faz parte do
  produto inicial.
- **Idioma da interface: pt-BR.** Textos, datas e formatação de valores seguirão
  a localidade brasileira. Resolve a pergunta 8 ao definir o idioma e a
  localidade suportados no escopo inicial.

## Suposições

- O usuário terá acesso à internet para realizar a busca e obter a previsão.
- O escopo inicial não exige autenticação nem perfis de usuário.
- Uma cidade será consultada por vez na experiência principal.
- A previsão será apresentada em visão diária, e não como uma linha do tempo
  horária, salvo decisão posterior em sentido contrário.
- A aplicação poderá depender de um serviço externo de dados meteorológicos.
- Celsius e Fahrenheit são as únicas unidades de temperatura necessárias no
  escopo inicial.
- O usuário utilizará um navegador moderno em um dispositivo móvel ou desktop.
- Os requisitos de conteúdo meteorológico, idioma, fonte de dados e política de
  armazenamento ainda serão definidos durante a especificação do produto.