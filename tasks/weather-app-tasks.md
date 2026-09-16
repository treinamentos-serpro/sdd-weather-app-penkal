# Backlog de Tarefas — Weather App

Fonte: `plans/weather-app-plan.md`. Cada tarefa é isolável, possui no máximo
dois arquivos relevantes e mantém testes como itens independentes.

## Rastreabilidade e evidência de aceite

Cada tarefa deve atender aos critérios descritos na sua seção e produzir a
evidência indicada abaixo. Para tarefas de implementação, a evidência é o teste
da tarefa dependente ou o teste integrado identificado; para tarefas de teste e
infraestrutura, é a execução bem-sucedida do comando ou cenário indicado.

| Requisito funcional | Tarefas de implementação | Tarefas de validação | Cobertura |
| --- | --- | --- | --- |
| RF1 — Buscar cidade | T-16, T-21, T-27, T-38 | T-03, T-17, T-24, T-28, T-44 | Completa |
| RF2 — Selecionar cidade | T-16, T-22, T-29, T-38 | T-03, T-17, T-25, T-30, T-44 | Completa |
| RF3 — Exibir clima atual | T-10, T-12, T-18, T-22, T-31, T-38 | T-04, T-11, T-13, T-19, T-25, T-33, T-44 | Completa |
| RF4 — Exibir previsão de cinco dias | T-10, T-12, T-18, T-22, T-32, T-38 | T-04, T-11, T-13, T-19, T-25, T-33, T-44 | Completa |
| RF5 — Alternar unidade de temperatura | T-08, T-20, T-34 | T-09, T-24, T-35, T-39 | Completa |
| RF6 — Atualizar valores ao trocar a unidade | T-08, T-20, T-31, T-32, T-34 | T-09, T-24, T-33, T-35, T-39 | Completa |
| RF7 — Informar estados da operação | T-07, T-14, T-21, T-22, T-23, T-36 | T-03, T-04, T-15, T-17, T-19, T-24, T-25, T-37, T-40 | Completa |
| RF8 — Tentar novamente | T-07, T-14, T-21, T-22, T-36 | T-15, T-24, T-25, T-37, T-40 | Completa |
| RF9 — Operar por teclado | T-27, T-29, T-34, T-36, T-38 | T-28, T-30, T-35, T-37, T-41, T-44 | Completa |
| RF10 — Descartar respostas obsoletas | T-14, T-23 | T-15, T-25, T-41 | Completa |
| RF11 — Tratar dados incompletos | T-05, T-06, T-07, T-10, T-16, T-18, T-29, T-36 | T-03, T-04, T-11, T-17, T-19, T-25, T-30, T-37, T-40 | Completa |

Não há requisito funcional sem tarefa correspondente. As tarefas de
implementação constroem o comportamento; as tarefas de validação exercitam os
critérios de aceite e os cenários de falha associados.

## Priorização e sequência de entrega

- **P0:** necessário para disponibilizar o fluxo principal utilizável.
- **P1:** necessário para elevar a confiabilidade, acessibilidade e cobertura do
	fluxo antes da entrega.
- **P2:** validação final e hardening de entrega.
- **P:** pequeno, até meio dia; **M:** médio, até um dia; **G:** grande, até dois
	dias. Uma tarefa G deve ser reavaliada e dividida se ultrapassar essa estimativa.

As fatias abaixo respeitam as dependências. As tarefas de teste da fatia devem
ser executadas ao terminar cada implementação correspondente, não acumuladas
para o fim.

1. **Fatia 0 — Habilitação de feedback:** T-01, T-02, T-03 e T-04. Deixa mocks,
	testes e E2E disponíveis enquanto a primeira interface é construída.
2. **Preparação visível — Casca interativa:** T-05, T-08, T-20, T-26 e T-34;
	validar com T-09 e T-35. Mostra cedo a tela responsiva e o controle de
	unidade, sem anunciar valor de produto antes que dados reais existam.
3. **Fatia 1 — Consulta completa:** T-06, T-07, T-10, T-12, T-14, T-16, T-18,
	T-21, T-22, T-23, T-27, T-29, T-31, T-32, T-36 e T-38; validar com T-11,
	T-13, T-15, T-17, T-19, T-24, T-25, T-28, T-30, T-33 e T-37. É a primeira
	fatia vertical: busca, desambiguação, seleção, clima atual, cinco dias,
	unidade, estados, retry e descarte de respostas obsoletas na mesma tela.
4. **Fatia 2 — Confiança de entrega:** T-44, T-39, T-40, T-41, T-42 e T-43.
	 Exercita o fluxo completo em mobile, teclado, falhas e responsividade antes
	 da liberação.

## Entrega 1 — Tipos e contratos

### T-05 — Definir modelos internos
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Declarar tipos estritos de cidade, relatório, unidade e estado.
- **Critérios de aceite:** `City`, `WeatherReport`, `WeatherAppState` e estados de operação correspondem ao plano e compilam em modo strict.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`.

### T-06 — Definir DTOs externos
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** P
- **Descrição:** Declarar contratos permissivos dos payloads da Open-Meteo.
- **Critérios de aceite:** DTOs contêm apenas campos consumidos e todos os campos externos são opcionais.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/types/api.ts`.

### T-07 — Definir erros recuperáveis
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** P
- **Descrição:** Declarar erros por operação e código de falha.
- **Critérios de aceite:** Há distinção entre `network`, `timeout`, `service` e `invalid-data`, com operação, mensagem em pt-BR e recuperação possível.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/types/errors.ts`.

## Entrega 2 — Funções puras de domínio

### T-08 — Implementar conversão de temperatura
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** P
- **Descrição:** Converter Celsius para Fahrenheit e arredondar meios afastando de zero.
- **Critérios de aceite:** A fórmula é $F = (C \times 9/5) + 32$; $-1{,}5$ arredonda para $-2$ e $1{,}5$ para $2$.
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/domain/temperature.ts`.

### T-10 — Implementar mapeamento WMO
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** P
- **Descrição:** Converter códigos WMO em condições meteorológicas em pt-BR.
- **Critérios de aceite:** Todos os códigos previstos são mapeados; código ausente ou desconhecido retorna `Condição indisponível`.
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/domain/weatherCodes.ts`.

### T-12 — Implementar formatação local de data e hora
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** P
- **Descrição:** Formatar previsão e `Atualizado às HH:mm` no fuso da cidade.
- **Critérios de aceite:** As funções usam `Intl.DateTimeFormat` com timezone explícito e não dependem do fuso do navegador.
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/domain/dateTime.ts`.

## Entrega 3 — Services e transporte

### T-14 — Implementar helper HTTP com timeout
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Criar requisição HTTP com timeout de 10 segundos e sinal externo.
- **Critérios de aceite:** Timeout inicia junto da requisição; HTTP, rede e timeout recebem erros distintos; cancelamento externo é distinguível.
- **Dependências:** T-07.
- **Arquivos prováveis:** `src/services/http.ts`.

### T-16 — Implementar serviço de geocodificação
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Consultar localidades e adaptar itens válidos para `City`.
- **Critérios de aceite:** URL usa trim, `count=10`, `language=pt` e `format=json`; ordem é preservada; `admin1` vira `region`; sem `results` retorna lista vazia.
- **Dependências:** T-05, T-06, T-14.
- **Arquivos prováveis:** `src/services/geocodingService.ts`.

### T-18 — Implementar serviço de previsão
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** G
- **Descrição:** Consultar clima atual e previsão diária e retornar relatório validado.
- **Critérios de aceite:** URL inclui coordenadas, campos atuais/diários, `timezone=auto`, `forecast_days=5` e `temperature_unit=celsius`; valida timezone, clima atual e cinco dias consecutivos alinhados.
- **Dependências:** T-05, T-06, T-10, T-14.
- **Arquivos prováveis:** `src/services/weatherService.ts`.

## Entrega 4 — Hook e concorrência

### T-20 — Implementar estado básico do hook
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** P
- **Descrição:** Criar `useWeatherApp` com query e unidade controladas.
- **Critérios de aceite:** Unidade inicia em Celsius; query é atualizável; alternância não muta relatório nem acessa a rede.
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.

### T-21 — Implementar busca e retry no hook
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Coordenar validação local, estados de busca, geocodificação e retry pelo termo submetido.
- **Critérios de aceite:** Espaços não chamam serviço; busca publica loading/success/empty/error; retry usa o termo preservado.
- **Dependências:** T-16, T-20.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.

### T-22 — Implementar seleção e retry de clima no hook
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Coordenar cidade, invalidação do clima anterior, previsão e retry pela cidade preservada.
- **Critérios de aceite:** Seleção preserva `City`, limpa relatório antigo, inicia loading e permite retry apenas após falha.
- **Dependências:** T-18, T-21.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.

### T-23 — Implementar descarte de operações obsoletas
- **Tipo:** Data | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Adicionar controladores e IDs independentes para busca e previsão concorrentes.
- **Critérios de aceite:** Nova operação aborta a anterior da mesma categoria; só o ID atual publica estado; desmontagem cancela pendências.
- **Dependências:** T-22.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.

## Entrega 5 — Componentes e interface acessível

### T-26 — Construir composição e layout base
- **Tipo:** UI | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Compor a tela única e aplicar layout dark glassmorphism mobile-first.
- **Critérios de aceite:** A tela reserva áreas para busca, resultados, clima, previsão e status; não há rolagem horizontal nos viewports previstos.
- **Dependências:** T-20.
- **Arquivos prováveis:** `src/App.tsx`, `src/index.css`.

### T-27 — Implementar campo de busca
- **Tipo:** UI | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Criar campo acessível controlado pelo hook e acionável por Enter ou botão.
- **Critérios de aceite:** Campo tem rótulo e botão nomeado; Enter submete; espaços exibem orientação e mantêm foco.
- **Dependências:** T-21, T-26.
- **Arquivos prováveis:** `src/components/CitySearch.tsx`.

### T-29 — Implementar resultados e seleção por teclado
- **Tipo:** UI | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Exibir localidades inequívocas e encaminhar seleção ao hook.
- **Critérios de aceite:** Opções contêm nome, país e região quando disponível; são alcançáveis por teclado; ausência opcional usa `Indisponível`.
- **Dependências:** T-21, T-26.
- **Arquivos prováveis:** `src/components/SearchResults.tsx`.

### T-31 — Implementar painel de clima atual
- **Tipo:** UI | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Exibir condição, temperatura e horário local.
- **Critérios de aceite:** Usa timezone da cidade, informa unidade e não apresenta relatório durante carregamento de outra cidade.
- **Dependências:** T-12, T-22, T-26.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.

### T-32 — Implementar lista de previsão diária
- **Tipo:** UI | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Exibir cinco dias com condição, mínima e máxima.
- **Critérios de aceite:** Renderiza exatamente cinco itens com data localizada e temperaturas na unidade ativa.
- **Dependências:** T-12, T-22, T-26.
- **Arquivos prováveis:** `src/components/DailyForecast.tsx`.

### T-34 — Implementar controle de unidade
- **Tipo:** UI | **Prioridade:** P0 | **Tamanho:** P
- **Descrição:** Criar controle acessível entre Celsius e Fahrenheit.
- **Critérios de aceite:** Unidade ativa é identificável; funciona por teclado; mudança atualiza temperaturas sem rede.
- **Dependências:** T-20, T-26.
- **Arquivos prováveis:** `src/components/TemperatureToggle.tsx`.

### T-36 — Implementar estados e retry
- **Tipo:** UI | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Exibir loading, vazio e erro contextual para busca e clima.
- **Critérios de aceite:** Loading/vazio usam `role="status"`; erro usa `role="alert"`; retry é nomeado e só aparece após falha recuperável.
- **Dependências:** T-21, T-22, T-26.
- **Arquivos prováveis:** `src/components/OperationStatus.tsx`.

## Entrega 6 — Integração do fluxo principal

### T-38 — Integrar o fluxo principal
- **Tipo:** Integração | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Conectar o hook e os componentes à tela única, sem dados estáticos ou fluxos paralelos.
- **Critérios de aceite:** Uma busca válida permite selecionar uma cidade e exibir clima atual, previsão, unidade e estados pela mesma instância de `useWeatherApp`.
- **Dependências:** T-23, T-27, T-29, T-31, T-32, T-34, T-36.
- **Arquivos prováveis:** `src/App.tsx`.

## Entrega 7 — Testes automatizados

### T-01 — Configurar testes unitários
- **Tipo:** Infra | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Configurar Vitest, Testing Library e inicialização comum.
- **Critérios de aceite:** Vitest executa; Testing Library está disponível; `fetch` pode ser simulado globalmente.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `vite.config.ts`, `tests/setup.ts`.

### T-02 — Configurar testes E2E
- **Tipo:** Infra | **Prioridade:** P1 | **Tamanho:** M
- **Descrição:** Configurar Playwright para iniciar a SPA nos viewports definidos.
- **Critérios de aceite:** Playwright inicia a aplicação; há projetos para engines disponíveis; os viewports 320 x 568, 667 x 375 e 1280 x 720 estão definidos.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `playwright.config.ts`, `package.json`.

### T-03 — Criar fixtures de geocodificação
- **Tipo:** Test | **Prioridade:** P0 | **Tamanho:** P
- **Descrição:** Criar respostas determinísticas de localidades.
- **Critérios de aceite:** Há fixtures de sucesso com homônimos, vazio, dado inválido, HTTP falho e atraso.
- **Dependências:** T-01.
- **Arquivos prováveis:** `tests/fixtures/geocoding.ts`.

### T-04 — Criar fixtures de previsão
- **Tipo:** Test | **Prioridade:** P0 | **Tamanho:** M
- **Descrição:** Criar respostas determinísticas de previsão meteorológica.
- **Critérios de aceite:** Há fixtures de sucesso, WMO desconhecido, arrays desalinhados, dados parciais, HTTP falho e atraso.
- **Dependências:** T-01.
- **Arquivos prováveis:** `tests/fixtures/forecast.ts`.

### T-09 — Testar unitariamente a conversão de unidade
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** P
- **Descrição:** Testar isoladamente a conversão Celsius/Fahrenheit e o arredondamento com positivos, negativos e limites.
- **Critérios de aceite:** Testes unitários aprovam $0\,°C = 32\,°F$, $100\,°C = 212\,°F$ e empates positivos/negativos arredondados para longe de zero, sem acessar a rede.
- **Dependências:** T-01, T-08.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.

### T-11 — Testar mapeamento WMO
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** P
- **Descrição:** Validar a tabela WMO completa e seu fallback.
- **Critérios de aceite:** Cada grupo WMO é exercitado e valores ausentes/desconhecidos usam o fallback.
- **Dependências:** T-01, T-10.
- **Arquivos prováveis:** `tests/unit/weatherCodes.test.ts`.

### T-13 — Testar formatação local de data e hora
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** P
- **Descrição:** Cobrir apresentação temporal em fusos distintos.
- **Critérios de aceite:** Há casos para dois fusos e para uma data que cruza meia-noite.
- **Dependências:** T-01, T-12.
- **Arquivos prováveis:** `tests/unit/dateTime.test.ts`.

### T-15 — Testar helper HTTP
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** M
- **Descrição:** Cobrir sucesso, rede, HTTP, timeout e cancelamento externo.
- **Critérios de aceite:** Timers falsos confirmam timeout aos 10 segundos; abort não vira timeout; códigos de falha são verificáveis.
- **Dependências:** T-01, T-14.
- **Arquivos prováveis:** `tests/unit/http.test.ts`.

### T-17 — Testar serviço de geocodificação com mock de fetch
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** M
- **Descrição:** Validar parâmetros, limite, campos opcionais e dados inválidos com `fetch` simulado na fronteira HTTP.
- **Critérios de aceite:** O mock de `fetch` confirma URL e parâmetros; fixtures cobrem sucesso, vazio, cidade inválida, HTTP, rede e timeout sem chamada à Open-Meteo.
- **Dependências:** T-01, T-03, T-16.
- **Arquivos prováveis:** `tests/unit/geocodingService.test.ts`.

### T-19 — Testar serviço de previsão com mock de fetch
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** M
- **Descrição:** Validar URL, relatório válido e rejeição de dados essenciais inválidos com `fetch` simulado na fronteira HTTP.
- **Critérios de aceite:** O mock de `fetch` confirma coordenadas e parâmetros; fixtures cobrem arrays desalinhados, menos de cinco dias, datas não consecutivas, WMO desconhecido e falhas de transporte sem rede real.
- **Dependências:** T-01, T-04, T-18.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.

### T-24 — Testar busca e estado básico do hook
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** M
- **Descrição:** Cobrir unidade, validação local, estados da busca e retry.
- **Critérios de aceite:** Testa Celsius inicial, espaços sem chamada, loading/success/empty/error e retry com termo preservado.
- **Dependências:** T-01, T-21.
- **Arquivos prováveis:** `tests/unit/useWeatherApp.search.test.tsx`.

### T-25 — Testar clima e concorrência do hook
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** G
- **Descrição:** Cobrir retry de clima, timeout, respostas antigas e desmontagem.
- **Critérios de aceite:** Timers falsos validam 10 segundos; retry usa a cidade preservada; respostas antigas não alteram estado.
- **Dependências:** T-01, T-23.
- **Arquivos prováveis:** `tests/unit/useWeatherApp.weather.test.tsx`.

### T-28 — Testar campo de busca
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** P
- **Descrição:** Validar semântica, Enter e busca vazia.
- **Critérios de aceite:** Exercita nome acessível, submissão por Enter/botão e ausência de chamada para espaços.
- **Dependências:** T-01, T-27.
- **Arquivos prováveis:** `tests/unit/CitySearch.test.tsx`.

### T-30 — Testar resultados de busca
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** P
- **Descrição:** Validar homônimos, campos e seleção por teclado.
- **Critérios de aceite:** Testes distinguem cidades homônimas, verificam fallback opcional e selecionam sem mouse.
- **Dependências:** T-01, T-29.
- **Arquivos prováveis:** `tests/unit/SearchResults.test.tsx`.

### T-33 — Testar clima atual e previsão
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** M
- **Descrição:** Validar conteúdo atual, timezone e cinco dias do relatório.
- **Critérios de aceite:** Testes verificam horário local, unidade explícita e exatamente cinco itens.
- **Dependências:** T-01, T-31, T-32.
- **Arquivos prováveis:** `tests/unit/weatherDisplay.test.tsx`.

### T-35 — Testar controle de unidade
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** P
- **Descrição:** Validar nome acessível e mudança de unidade.
- **Critérios de aceite:** Alterna por teclado e confirma o callback com a unidade escolhida.
- **Dependências:** T-01, T-34.
- **Arquivos prováveis:** `tests/unit/TemperatureToggle.test.tsx`.

### T-37 — Testar componente de estados loading, erro e vazio
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** M
- **Descrição:** Testar o componente de status nos estados loading, erro e vazio para busca e clima.
- **Critérios de aceite:** Testes de componente renderizam loading e vazio com `role="status"`, erro com `role="alert"`, mensagens em pt-BR e retry acessível apenas para erro recuperável.
- **Dependências:** T-01, T-36.
- **Arquivos prováveis:** `tests/unit/OperationStatus.test.tsx`.

### T-44 — Criar E2E do fluxo principal em mobile
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** M
- **Descrição:** Validar busca, desambiguação, seleção, clima atual e previsão no fluxo completo em viewport mobile.
- **Critérios de aceite:** Com rotas Open-Meteo interceptadas, o cenário em 390 x 844 px inicia busca, seleciona uma cidade entre homônimas por teclado e exibe clima atual e exatamente cinco datas locais sem rolagem horizontal.
- **Dependências:** T-02, T-03, T-04, T-38.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.

### T-39 — Criar E2E de unidade e nova busca
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** M
- **Descrição:** Validar Celsius/Fahrenheit e preservação da unidade numa nova busca.
- **Critérios de aceite:** Confere unidades no clima/previsão e prova que a nova busca mantém a escolha.
- **Dependências:** T-02, T-03, T-04, T-38.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.

### T-40 — Criar E2E de falhas e retry
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** M
- **Descrição:** Validar loading, vazio, erro, timeout e retry contextual.
- **Critérios de aceite:** Diferencia vazio de erro, aguarda timeout e confirma retry com termo ou cidade preservados.
- **Dependências:** T-02, T-03, T-04, T-38.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.

### T-41 — Criar E2E de teclado e concorrência
- **Tipo:** Test | **Prioridade:** P1 | **Tamanho:** M
- **Descrição:** Validar fluxo sem mouse, foco visível e descarte de resposta obsoleta.
- **Critérios de aceite:** Completa busca/seleção por teclado e confirma que somente a resposta recente aparece.
- **Dependências:** T-02, T-03, T-04, T-38.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.

## Entrega 8 — Hardening e validação final

### T-42 — Executar regressão responsiva
- **Tipo:** Test | **Prioridade:** P2 | **Tamanho:** M
- **Descrição:** Rodar E2E nos viewports e engines disponíveis.
- **Critérios de aceite:** Os três viewports passam sem corte, sobreposição ou rolagem horizontal; limitação de Safari real é registrada quando aplicável.
- **Dependências:** T-38, T-39, T-40, T-41, T-44.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`, `README.md`.

### T-43 — Executar validação final
- **Tipo:** Infra | **Prioridade:** P2 | **Tamanho:** P
- **Descrição:** Rodar as verificações obrigatórias após os fluxos integrados.
- **Critérios de aceite:** `pnpm lint`, `pnpm build` e `pnpm test` terminam sem falhas; execução E2E e limitações locais estão registradas.
- **Dependências:** T-09, T-11, T-13, T-15, T-17, T-19, T-24, T-25, T-28, T-30, T-33, T-35, T-37, T-42, T-44.
- **Arquivos prováveis:** `package.json`, `README.md`.