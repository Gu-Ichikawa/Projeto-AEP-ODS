# EcoQuest

Plataforma web para gamificar habitos sustentaveis, conectada a uma API simples em Java.

## ODS relacionada

O projeto conversa principalmente com a ODS 12: Consumo e Producao Responsaveis. Tambem pode ser apresentado como apoio a ODS 13, por reduzir impactos ligados a carbono, agua, energia e residuos.

## Tecnologias

- Frontend: HTML, CSS e JavaScript.
- Backend: Java 17 com `HttpServer` nativo.
- Estruturas de dados: fila de missoes pendentes, lista encadeada de itens para troca e listas para missoes/ranking.

## Como executar

Compile o backend:

```powershell
javac -encoding UTF-8 -d out (Get-ChildItem -Recurse src -Filter *.java).FullName
```

Rode o servidor:

```powershell
java -cp out ecoquest.Main
```

Abra no navegador:

```text
http://localhost:8080
```

## Endpoints principais

- `GET /api/estado`: retorna usuario, missoes, ranking, conquistas, impacto e itens.
- `POST /api/missoes/{id}/concluir`: conclui uma missao e atualiza os pontos.
- `POST /api/itens`: cadastra item de troca e pontua o usuario.
- `POST /api/reset`: reinicia a demonstracao.
