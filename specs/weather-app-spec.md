# Especificação de Produto — Weather App

## Overview

O Weather App é uma aplicação web de previsão do tempo para consulta rápida das
condições meteorológicas de uma cidade. O produto permite pesquisar e selecionar
uma localização, consultar o clima atual e visualizar a previsão diária de cinco
dias, contando o dia atual e os quatro dias seguintes.

O produto atende pessoas que precisam tomar decisões imediatas antes de sair de
casa e pessoas que planejam atividades futuras. A experiência é mobile-first,
também utilizável em desktop, anônima e em pt-BR. Os dados meteorológicos e de
localização são fornecidos pela Open-Meteo, sem necessidade de chave de API.

### Objetivos do produto

- Permitir que o usuário encontre a cidade correta, inclusive quando existirem
  localidades homônimas.
- Apresentar clima atual e previsão de cinco dias de forma rápida e legível.
- Permitir a leitura de temperaturas em Celsius ou Fahrenheit.
- Manter o usuário informado durante carregamentos, buscas vazias e falhas.
- Oferecer uma experiência acessível e responsiva em navegadores modernos.

### Indicadores de sucesso

- Em teste de usabilidade no viewport de 390 × 844 px, o usuário consegue, em até
  dois minutos entre a primeira interação e a exibição da previsão, localizar
  uma cidade e interpretar os cinco dias sem repetir a busca.
- Em teste de usabilidade no mesmo viewport, o usuário consegue, em até 30
  segundos entre a primeira interação e a exibição do resultado, selecionar uma
  cidade e identificar sua temperatura e condição atual.
- O usuário consegue distinguir cidades homônimas e confirmar a unidade de
  temperatura exibida em todos os cenários de aceite correspondentes.

## Functional Requirements

- **RF1 — Buscar cidade:** permitir que o usuário informe o nome de uma cidade e
  inicie uma busca. Entradas vazias ou compostas apenas por espaços não devem
  iniciar uma consulta. Devem ser exibidos até dez resultados, ordenados por
  relevância conforme retornados pela fonte de dados.
- **RF2 — Selecionar cidade:** apresentar os resultados encontrados com nome da
  cidade, país e estado ou região quando essa informação estiver disponível, e
  permitir a seleção de uma única cidade para a consulta meteorológica.
- **RF3 — Exibir clima atual:** após a seleção, exibir a cidade consultada, a
  temperatura atual, a unidade ativa, uma descrição da condição meteorológica e
  o horário de atualização no fuso local da cidade.
- **RF4 — Exibir previsão de cinco dias:** exibir exatamente cinco datas locais
  consecutivas, começando no dia atual da cidade selecionada, cada uma com
  temperaturas mínima e máxima e condição meteorológica.
- **RF5 — Alternar unidade de temperatura:** disponibilizar a alternância entre
  Celsius e Fahrenheit. Celsius deve ser a unidade inicial de cada nova sessão;
  a seleção deve permanecer ativa durante a sessão e não deve ser persistida
  após seu encerramento. A sessão começa ao carregar a aplicação e termina ao
  fechar ou recarregar a página.
- **RF6 — Atualizar valores ao trocar a unidade:** ao mudar a unidade, atualizar
  todos os valores de temperatura visíveis, atuais e previstos, mantendo os
  mesmos dados, cidade e período consultados. Todas as temperaturas devem ser
  exibidas como números inteiros, arredondados para o inteiro mais próximo; em
  empates de meio grau, o arredondamento deve se afastar de zero.
- **RF7 — Informar estados da operação:** comunicar estados de carregamento,
  ausência de resultados e erro, sem apresentar esses estados como dados
  meteorológicos válidos.
- **RF8 — Tentar novamente:** após falha recuperável de rede ou serviço, oferecer
  uma ação para repetir a operação que falhou, preservando a consulta relevante.
- **RF9 — Operar por teclado:** permitir iniciar a busca, percorrer e selecionar
  resultados, alternar a unidade e tentar novamente usando apenas o teclado,
  com foco visível durante todo o fluxo.
- **RF10 — Descartar respostas obsoletas:** quando houver operações concorrentes,
  somente a resposta associada à busca ou seleção mais recente deve atualizar a
  interface.
- **RF11 — Tratar dados incompletos:** não inventar valores ausentes ou inválidos.
  Campos opcionais isolados devem ser identificados como “Indisponível”; se um
  campo essencial de cidade, data, temperatura ou condição não puder ser
  associado com segurança, a consulta deve ser tratada como erro recuperável.

### Vocabulário de condições meteorológicas

As condições devolvidas pela Open-Meteo devem seguir este mapeamento dos códigos
meteorológicos WMO:

| Códigos | Condição em pt-BR |
| --- | --- |
| 0 | Céu limpo |
| 1, 2 | Parcialmente nublado |
| 3 | Nublado |
| 45, 48 | Neblina |
| 51, 53, 55, 56, 57 | Garoa |
| 61, 63, 65, 66, 67 | Chuva |
| 71, 73, 75, 77 | Neve |
| 80, 81, 82, 85, 86 | Pancadas |
| 95, 96, 99 | Tempestade |

Um código ausente ou sem correspondência conhecida deve ser exibido como
“Condição indisponível”, sem impedir a leitura dos demais dados válidos.

## Regras operacionais e contratos

### Contratos de entrada e saída

- A busca de cidades deve usar o termo digitado pelo usuário após trim de espaços
  em início e fim. Termos vazios ou compostos apenas por espaços devem ser
  rejeitados antes do disparo da requisição.
- A listagem de resultados deve exibir no máximo dez itens, mantendo a ordem
  retornada pela fonte de dados. Caso a API retorne mais itens, apenas os dez
  primeiros devem ser apresentados.
- A seleção deve preservar a referência exata da cidade escolhida: nome
  completo, país, região/estado quando disponível, latitude e longitude. A
  consulta meteorológica deve ser disparada somente após a confirmação da cidade
  selecionada.
- A consulta do clima atual e da previsão deve utilizar as coordenadas da cidade
  escolhida e o fuso horário da localidade para exibir datas e horários
  corretamente.
- Qualquer resposta com cidade, data, temperatura ou condição sem associação
  confiável deve ser tratada como dado inválido, sem substituição por valores
  estimados ou inferidos.

### Regras de validação e apresentação

- Campos opcionais ausentes devem ser exibidos como “Indisponível”, mas nunca
  devem ocultar ou substituir informações obrigatórias.
- As mensagens de erro e carregamento devem ser sempre textuais, em pt-BR e
  específicas para a operação em execução: busca, clima atual, previsão, retry.
- Troca de unidade e atualização da tela devem ocorrer sem alterar cidade,
  período da previsão, nomes de campos ou indicadores de erro/estado já
  exibidos.
- A aplicação deve registrar, no máximo, uma operação ativa de busca e uma
  operação ativa de clima por vez no fluxo principal; qualquer resposta vinculada
  a uma requisição anterior deve ser ignorada quando houver uma operação mais
  recente.
- O timeout de dez segundos deve começar no momento do disparo da requisição.
  Caso o tempo seja excedido, a operação deve ser encerrada como falha
  recuperável e o estado de erro correspondente deve ser exibido sem tentativa
  automática adicional.

## User Stories

- **US1 — Busca rápida:** Como João, decisor do dia a dia, quero buscar uma
  cidade para consultar seu clima atual antes de sair de casa.
- **US2 — Desambiguação:** Como Aisha, usuária internacional, quero identificar
  país e região nos resultados para selecionar a cidade correta entre
  localidades com o mesmo nome.
- **US3 — Clima atual:** Como João, decisor do dia a dia, quero visualizar a
  temperatura e a condição atual para decidir sobre roupa, transporte e
  guarda-chuva.
- **US4 — Planejamento:** Como Mariana, planejadora de atividades, quero
  visualizar a previsão dos próximos cinco dias para escolher quando realizar
  atividades e compromissos.
- **US5 — Unidade familiar:** Como Aisha, usuária internacional, quero alternar
  entre Celsius e Fahrenheit para interpretar as temperaturas na unidade com a
  qual estou acostumada.
- **US6 — Transparência da operação:** Como usuário em uma conexão móvel, quero
  saber quando uma consulta está carregando, não encontrou resultados ou falhou
  para entender o estado da aplicação.
- **US7 — Recuperação de falha:** Como usuário em uma conexão instável, quero
  repetir uma consulta que falhou para obter os dados sem preencher tudo
  novamente.
- **US8 — Uso em telas pequenas:** Como João, usuário predominantemente mobile,
  quero executar todo o fluxo em uma tela pequena para consultar o clima durante
  deslocamentos.
- **US9 — Resultado atual:** Como usuário que refaz uma busca rapidamente, quero
  ver somente a resposta da consulta mais recente para não tomar decisões com
  dados de outra cidade.
- **US10 — Dados confiáveis:** Como usuário, quero identificar informações
  indisponíveis para não interpretar valores ausentes como dados meteorológicos
  válidos.

## Acceptance Criteria

### RF1 — Buscar cidade / US1

- **Dado** que o campo contém um nome de cidade não vazio, **quando** o usuário
  inicia a busca e a fonte retorna resultados, **então** a aplicação apresenta
  no máximo dez localidades na ordem de relevância fornecida, cada uma com nome,
  país e região quando disponível.
- **Dado** que o campo está vazio ou contém apenas espaços, **quando** o usuário
  tenta iniciar a busca, **então** nenhuma consulta é realizada e uma orientação
  de preenchimento é apresentada.

### RF2 — Selecionar cidade / US2

- **Dado** que a busca encontrou uma ou mais localidades, **quando** os
  resultados são apresentados, **então** cada resultado exibe cidade e país,
  além de estado ou região quando disponível.
- **Dado** que há cidades homônimas nos resultados, **quando** o usuário seleciona
  uma delas, **então** os dados meteorológicos solicitados correspondem às
  coordenadas da opção selecionada.

### RF3 — Exibir clima atual / US3

- **Dado** que uma cidade foi selecionada e a consulta foi concluída com
  sucesso, **quando** o clima atual é apresentado, **então** são exibidos nome da
  cidade, temperatura atual, unidade ativa e descrição da condição
  meteorológica pertencente ao vocabulário definido nesta spec.
- **Dado** que a cidade selecionada possui fuso horário diferente do dispositivo,
  **quando** os dados atuais são apresentados, **então** a referência temporal é
  exibida como “Atualizado às HH:mm” no fuso horário da cidade.

### RF4 — Exibir previsão de cinco dias / US4

- **Dado** que uma cidade foi selecionada e a previsão foi obtida com sucesso,
  **quando** a previsão é apresentada, **então** são exibidos exatamente cinco
  dias: a data atual da cidade e os quatro dias seguintes.
- **Dado** que a previsão está visível, **quando** o usuário consulta qualquer um
  dos cinco dias, **então** encontra data, temperaturas mínima e máxima, unidade
  e descrição da condição meteorológica daquele dia.

### RF5 — Alternar unidade de temperatura / US5

- **Dado** que o usuário inicia uma nova sessão, **quando** alguma temperatura é
  apresentada, **então** Celsius é a unidade ativa e está
  explicitamente identificada.
- **Dado** que há temperaturas exibidas, **quando** o usuário alterna a unidade,
  **então** a unidade ativa muda de Celsius para Fahrenheit ou de Fahrenheit
  para Celsius.
- **Dado** que o usuário alterou a unidade durante a sessão, **quando** realiza
  novas buscas, **então** a unidade escolhida permanece ativa até o encerramento
  da sessão.

### RF6 — Atualizar valores ao trocar a unidade / US5

- **Dado** que o clima atual e a previsão estão visíveis em Celsius, **quando** o
  usuário seleciona Fahrenheit, **então** todas as temperaturas visíveis são
  convertidas segundo a relação $°F = (°C × 9/5) + 32$ e identificadas em
  Fahrenheit, com arredondamento para o inteiro mais próximo; por exemplo,
  $0\,°C$ resulta em $32\,°F$, $100\,°C$ resulta em $212\,°F$ e valores em meio
  grau são arredondados para longe de zero.
- **Dado** que o usuário troca a unidade, **quando** os valores são atualizados,
  **então** cidade, condições meteorológicas e intervalo de cinco dias permanecem
  inalterados.

### RF7 — Informar estados da operação / US6

- **Dado** que uma busca ou consulta meteorológica está em andamento, **quando**
  ainda não há resposta, **então** uma mensagem textual de carregamento específica
  para a operação é apresentada e anunciada por tecnologia assistiva.
- **Dado** que a busca por cidade termina sem resultados, **quando** a resposta é
  processada, **então** é apresentada uma mensagem de ausência de resultados e
  nenhum dado meteorológico anterior é atribuído ao termo buscado.
- **Dado** que uma consulta falha, **quando** o erro é identificado, **então** uma
  mensagem em pt-BR informa que não foi possível concluir a operação e a
  interface não permanece em carregamento indefinido.
- **Dado** que uma operação permanece sem resposta por dez segundos, **quando** o
  limite é atingido, **então** ela é encerrada como timeout, sem nova tentativa
  automática, e o respectivo estado de erro é apresentado.

### RF8 — Tentar novamente / US7

- **Dado** que uma operação falhou por erro recuperável de rede, timeout ou
  indisponibilidade do serviço, **quando** o erro é apresentado, **então** uma
  ação de tentar novamente fica disponível.
- **Dado** que uma consulta meteorológica falhou após a seleção de uma cidade,
  **quando** o usuário aciona tentar novamente, **então** a consulta é repetida
  para a mesma cidade, coordenadas e unidade sem exigir uma nova busca ou
  seleção.
- **Dado** que uma busca de localidades falhou, **quando** o usuário aciona
  tentar novamente, **então** a busca é repetida com o texto digitado preservado.

### RF9 — Operar por teclado / US8

- **Dado** que o foco está no campo de busca preenchido, **quando** o usuário
  pressiona Enter, **então** a busca é iniciada.
- **Dado** que os resultados estão visíveis, **quando** o usuário navega somente
  pelo teclado, **então** consegue alcançar cada opção, identificar visualmente
  o foco e selecionar uma cidade sem usar o mouse.
- **Dado** qualquer controle interativo do fluxo principal, **quando** recebe
  foco, **então** possui nome acessível e indicador de foco visível.

### RF10 — Descartar respostas obsoletas / US9

- **Dado** que uma busca anterior ainda está em andamento, **quando** uma nova
  busca é iniciada e a resposta anterior chega depois, **então** a resposta
  anterior não altera os resultados da busca mais recente.
- **Dado** que uma consulta meteorológica está em andamento, **quando** outra
  cidade é selecionada, **então** somente os dados da última cidade selecionada
  podem ser apresentados como resultado atual.

### RF11 — Tratar dados incompletos / US10

- **Dado** que a resposta contém um campo opcional ausente, **quando** os
  demais dados podem ser associados com segurança à cidade e à data, **então** o
  campo ausente é exibido como “Indisponível” e os dados válidos permanecem
  visíveis.
- **Dado** que a resposta não permite associar cidade, data, temperatura ou
  condição com segurança, **quando** ela é processada, **então** nenhum resultado
  completo é exibido, a consulta é tratada como erro recuperável e a ação de
  tentar novamente fica disponível.

## Tabela de rastreabilidade

| User Story | História | Acceptance Criteria | RNFs relevantes |
| --- | --- | --- | --- |
| US1 | Busca rápida | RF1 | RNF2, RNF4, RNF10 |
| US2 | Desambiguação | RF2 | RNF2, RNF10 |
| US3 | Clima atual | RF3 | RNF8, RNF9, RNF10 |
| US4 | Planejamento | RF4 | RNF1, RNF9, RNF10 |
| US5 | Unidade familiar | RF5, RF6 | RNF4, RNF8, RNF9, RNF10 |
| US6 | Transparência da operação | RF7 | RNF3, RNF5, RNF10 |
| US7 | Recuperação de falha | RF8 | RNF2, RNF4, RNF5, RNF10 |
| US8 | Uso em telas pequenas | RF9 | RNF1, RNF3, RNF10 |
| US9 | Resultado atual | RF10 | RNF5, RNF9, RNF10 |
| US10 | Dados confiáveis | RF11 | RNF5, RNF8, RNF9, RNF10 |

### Observações de uso

- A tabela deve orientar a decomposição das tarefas por fluxo: busca, seleção,
  clima, previsão, unidade, estados de erro e acessibilidade.
- Cada Acceptance Criteria deve ser rastreado até ao menos um caso de teste e
  um requisito não funcional relevante para a validação de qualidade.
- Quando uma User Story cruza múltiplos fluxos, a mesma história pode alimentar
  mais de uma tarefa e mais de um teste automatizado.

## Non-Functional Requirements

- **RNF1 — Responsividade:** todo o fluxo principal deve ser utilizável sem
  rolagem horizontal em viewports a partir de 320 px de largura e adaptar-se a
  telas mobile e desktop, em orientação retrato ou paisagem. Campo de busca,
  resultados, controles, clima atual, previsão e mensagens não podem se sobrepor
  nem ficar inacessíveis.
- **RNF2 — Usabilidade:** busca, seleção, consulta e troca de unidade devem ter
  rótulos e estados compreensíveis. O resultado atual deve ser alcançável em um
  único fluxo, sem exigir repetição da busca após a seleção da cidade.
- **RNF3 — Acessibilidade:** controles e resultados devem usar estrutura
  semântica, nomes acessíveis, ordem de foco coerente e foco visível; todo o
  fluxo deve ser operável por teclado. Texto e controles devem atingir contraste
  mínimo WCAG 2.1 AA.
- **RNF4 — Performance percebida:** toda operação assíncrona deve apresentar
  feedback visual em até 100 ms após ser iniciada. A troca de unidade deve
  atualizar todos os valores em até 100 ms. Consultas externas sem resposta
  devem respeitar o timeout de dez segundos.
- **RNF5 — Disponibilidade e resiliência:** falhas e respostas incompletas de
  serviços externos não devem bloquear a navegação, produzir carregamento
  indefinido nem ser exibidas como dados válidos.
- **RNF6 — Compatibilidade:** o produto deve funcionar nas versões estáveis
  atuais e imediatamente anteriores de Chrome, Firefox e Safari na data de cada
  lançamento, em mobile e desktop quando disponíveis.
- **RNF7 — Privacidade e segurança:** nenhuma conta ou dado pessoal deve ser
  solicitado. A comunicação com serviços externos deve ocorrer por conexão
  segura, e os termos pesquisados não devem ser persistidos em servidor próprio.
- **RNF8 — Internacionalização:** interface, mensagens e datas devem ser
  exibidas em pt-BR. A unidade de temperatura deve permanecer explícita mesmo
  quando divergir da convenção da localidade.
- **RNF9 — Consistência de dados:** localização, datas e condições devem
  permanecer associadas à cidade selecionada. As datas devem considerar o fuso
  horário da cidade, e a troca de unidade não deve alterar a localização nem o
  período da previsão.
- **RNF10 — Testabilidade:** busca, desambiguação, exibição do clima, intervalo
  de cinco dias, conversão de unidade, estados operacionais, recuperação de erro,
  navegação por teclado, descarte de respostas obsoletas, dados incompletos e
  responsividade devem possuir critérios passíveis de validação automatizada.
- **RNF11 — Manutenibilidade:** regras de apresentação, consulta a serviços
  externos e transformação dos dados devem poder evoluir de forma independente,
  sem alterar o comportamento especificado para o usuário.

### Critérios não funcionais verificáveis

- **RNF1:** em viewports de 320 × 568 px, 667 × 375 px e 1280 × 720 px, todo o
  fluxo principal deve permanecer utilizável sem rolagem horizontal,
  sobreposição ou corte de conteúdo interativo.
- **RNF3:** uma verificação automatizada deve confirmar que todos os controles
  possuem nome acessível, as mensagens de carregamento e erro são anunciadas,
  o fluxo principal é concluído somente por teclado e o contraste atende à WCAG
  2.1 AA.
- **RNF4:** medições automatizadas devem confirmar feedback de operação e troca
  de unidade dentro dos limites de 100 ms, além do encerramento de consultas sem
  resposta em dez segundos.
- **RNF6:** o fluxo principal deve ser aprovado na matriz das versões atuais e
  imediatamente anteriores dos navegadores declarados.

## Edge Cases

| Caso | Comportamento esperado |
| --- | --- |
| Campo vazio ou apenas com espaços | Não realizar a busca e orientar o preenchimento do nome da cidade. |
| Cidade inexistente | Informar que nenhuma cidade foi encontrada e permitir uma nova busca. |
| Termo com acentos, hífen ou apóstrofo | Enviar o termo válido à busca e apresentar os resultados devolvidos pelo serviço sem erro de interface. |
| Cidades com o mesmo nome | Listar país e região disponível para permitir a seleção inequívoca. |
| Resultado sem estado ou região | Exibir cidade e país sem criar informação substituta nem impedir a seleção. |
| Busca sem resultados de geocodificação | Exibir estado vazio, sem iniciar consulta meteorológica. |
| Falha na busca de cidades | Exibir erro da busca e permitir tentar novamente com o termo preservado. |
| Falha na consulta de clima ou previsão | Exibir erro da consulta e permitir tentar novamente para a cidade selecionada. |
| Timeout ou perda de conexão | Encerrar o carregamento, informar a falha de conexão e oferecer nova tentativa. |
| Resposta meteorológica parcial | Exibir campo opcional ausente como “Indisponível”; tratar como erro recuperável se cidade, data, temperatura ou condição não puder ser associada com segurança. |
| Troca repetida entre Celsius e Fahrenheit | Manter valores consistentes com a unidade ativa, sem alterar cidade, datas ou condições. |
| Mudança de data em fusos horários distintos | Determinar “hoje” pelo fuso da cidade selecionada, não pelo fuso do dispositivo. |
| Nova busca após resultado anterior | Não associar dados da cidade anterior à nova seleção durante carregamento, vazio ou erro. |
| Resposta antiga recebida após uma nova busca | Descartá-la sem substituir resultados ou dados associados à operação mais recente. |
| Código meteorológico desconhecido | Exibir “Condição indisponível” e preservar os demais dados válidos. |
| Navegação somente por teclado | Permitir buscar, percorrer e selecionar resultados, alternar unidade e tentar novamente com foco visível. |

## Assumptions

- O usuário dispõe de conexão com a internet durante as consultas; não há modo
  offline na primeira versão.
- A Open-Meteo permanece disponível para geocodificação e dados meteorológicos,
  sem chave de API.
- Uma única cidade é consultada por vez.
- A previsão é diária e compreende hoje, no fuso da cidade, mais quatro dias.
- Celsius e Fahrenheit são as únicas unidades de temperatura necessárias.
- Celsius é a unidade padrão no início de cada sessão; uma alteração permanece
  ativa até a página ser fechada ou recarregada.
- O produto é anônimo, sem autenticação, perfil ou persistência de cidades.
- O único idioma e localidade da primeira versão é pt-BR.
- O conteúdo meteorológico obrigatório limita-se à temperatura e à condição;
  informações adicionais dependem de decisão posterior.
- Os dados devolvidos pela fonte são adequados para consulta informativa e não
  substituem alertas oficiais de emergência.

## Risks

| Risco | Probabilidade | Impacto | Mitigação de produto |
| --- | --- | --- | --- |
| Indisponibilidade, lentidão ou limitação da Open-Meteo | Média | Alto | Comunicar carregamento e erro, limitar espera e oferecer nova tentativa. |
| Resultados ambíguos para cidades homônimas | Alta | Médio | Exibir país e região disponível antes da seleção. |
| Interpretação incorreta do intervalo da previsão | Média | Alto | Exibir exatamente hoje + quatro dias, com datas locais identificáveis. |
| Conversão ou arredondamento inconsistente entre unidades | Baixa | Médio | Usar a fórmula definida, arredondar para o inteiro mais próximo e validar valores de referência. |
| Datas incorretas por diferença de fuso horário | Média | Alto | Associar “hoje” e as datas da previsão ao fuso da cidade selecionada. |
| Layout difícil de operar em telas pequenas | Média | Alto | Priorizar mobile, impedir rolagem horizontal e validar viewports a partir de 320 px. |
| Resposta parcial ou mudança no serviço externo | Média | Médio | Não inventar dados, preservar campos válidos e comunicar indisponibilidade dos demais. |
| Uso dos dados para decisão de segurança ou emergência | Baixa | Alto | Tratar o produto como consulta informativa e manter alertas oficiais fora do escopo. |

## Out of Scope

- Autenticação, contas, perfis e persistência em servidor.
- Histórico de buscas, última cidade e cidades favoritas persistentes.
- Geolocalização automática ou solicitação da localização do dispositivo.
- Consulta simultânea ou comparação entre várias cidades.
- Previsão horária ou intervalo superior a cinco dias.
- Mapas meteorológicos, radar, imagens de satélite e gráficos históricos.
- Alertas meteorológicos oficiais, notificações push e recomendações de
  segurança.
- Idiomas ou localidades além de pt-BR.
- Unidades de temperatura além de Celsius e Fahrenheit.
- Funcionamento offline ou exibição garantida de dados armazenados em cache.
- Informações meteorológicas adicionais, como umidade, vento, precipitação,
  pressão e sensação térmica, até que o escopo seja decidido.

## Open Questions

Não há questões bloqueantes para o desenvolvimento do escopo especificado.
Decisões sobre dados meteorológicos adicionais, modo offline, geolocalização,
última cidade e favoritos pertencem a versões futuras e permanecem fora do
escopo desta especificação.