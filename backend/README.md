# Plataforma de Aprendizagem e Discussao Comunitaria

Backend Java 17 + Spring Boot 4.0.0 para foruns hierarquicos, conteudos, quizzes em tempo real, notificacoes push e recuperacao de conta por OTP.

## Stack

- Java 17
- Spring Boot 4.0.0
- Spring Web, Security, Data JPA, WebSocket/STOMP, Mail, Validation, Cache
- MySQL 8.x
- Flyway
- JWT com `jjwt 0.11.5`
- BCrypt com strength 10
- Swagger em `/swagger-ui.html`

## Variaveis de Ambiente

```bash
SERVER_PORT=8080
DB_URL=jdbc:mysql://localhost:3306/plataforma?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=root
JWT_SECRET=change-this-secret-change-this-secret-32chars
JWT_EXPIRATION_MINUTES=120
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USERNAME=
SMTP_PASSWORD=
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Execucao

```bash
mvn spring-boot:run
```

## Testes

```bash
mvn test
```

## Arquitetura

```text
Controller -> Service -> Repository -> Entity
                 |
                DTO
```

Pacotes principais:

```text
com.plataforma
├── config
├── common
├── auth
├── usuario
├── recuperacaoconta
├── forum
├── topico
├── comentario
├── voto
├── conteudo
├── subscricao
├── quiz
├── notificacao
├── ranking
└── recomendacao
```

## WebSocket/STOMP

Handshake:

```text
/ws?token=JWT
```

Destinos:

```text
Cliente -> /app/quiz/{salaId}/responder
Servidor -> /topic/quiz/{salaId}/ranking
Servidor privado -> /user/queue/notificacoes
Servidor privado -> /user/queue/quiz/respostas
```

## Decisoes de Modelagem

- IDs usam `VARCHAR(36)` para UUIDs, mantendo o schema simples e portavel.
- `conteudos.tags` usa JSON para suportar tags livres como `textos com jindungo` sem tabelas auxiliares prematuras.
- `perguntas_quiz.alternativas` usa JSON porque as alternativas pertencem ao agregado da pergunta.
- `resposta_correta` existe apenas na entidade persistida e nunca e enviada no DTO publico `PerguntaQuizPayload`.
- `topicos.score` e `comentarios.score` sao materializados para leitura rapida e recalculados pelo modulo de votos.
- `membros_forum.pode_falar` e `suspenso_ate` suportam suspensao temporaria de fala.
- `regiao` e `instituicao` ficam em `utilizadores` para permitir ranking direto por agregacao.

## Regras Criticas Implementadas

- JWT com principal `UUID` e roles `ROLE_*`.
- BCryptPasswordEncoder com strength 10.
- OTP numerico de 6 digitos, expira em 10 minutos, uso unico e invalida apos 3 falhas.
- Comentarios recursivos sem limite de profundidade artificial.
- Voto unico por utilizador/entidade/tipo; repetir o mesmo voto remove o registro.
- Quiz com controle de lotacao em `ConcurrentHashMap`.
- Pontuacao Kahoot com penalidade linear maxima de 50%.
- Notificacoes desacopladas via evento Spring, `@Async` e STOMP.
- Rankings com cache invalidado ao registrar respostas de quiz.
