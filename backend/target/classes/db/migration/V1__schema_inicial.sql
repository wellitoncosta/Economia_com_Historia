CREATE TABLE utilizadores (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    pontos_acumulados INT DEFAULT 0,
    regiao VARCHAR(100),
    instituicao VARCHAR(150),
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE codigos_recuperacao (
    id VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(6) NOT NULL,
    utilizador_id VARCHAR(36) NOT NULL,
    data_expiracao DATETIME NOT NULL,
    foi_utilizado BOOLEAN DEFAULT FALSE,
    tentativas INT DEFAULT 0,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE
);

CREATE TABLE foruns (
    id VARCHAR(36) PRIMARY KEY,
    dono_id VARCHAR(36) NOT NULL,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    is_privado BOOLEAN DEFAULT FALSE,
    limite_utilizadores INT NOT NULL DEFAULT 1,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dono_id) REFERENCES utilizadores(id)
);

CREATE TABLE membros_forum (
    id VARCHAR(36) PRIMARY KEY,
    forum_id VARCHAR(36) NOT NULL,
    utilizador_id VARCHAR(36) NOT NULL,
    papel VARCHAR(30) NOT NULL,
    pode_falar BOOLEAN DEFAULT TRUE,
    suspenso_ate DATETIME NULL,
    data_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (forum_id, utilizador_id),
    FOREIGN KEY (forum_id) REFERENCES foruns(id) ON DELETE CASCADE,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE
);

CREATE TABLE topicos (
    id VARCHAR(36) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    autor_id VARCHAR(36) NOT NULL,
    forum_id VARCHAR(36) NOT NULL,
    score INT DEFAULT 0,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) REFERENCES utilizadores(id),
    FOREIGN KEY (forum_id) REFERENCES foruns(id) ON DELETE CASCADE
);

CREATE TABLE comentarios (
    id VARCHAR(36) PRIMARY KEY,
    texto TEXT NOT NULL,
    topico_id VARCHAR(36) NOT NULL,
    autor_id VARCHAR(36) NOT NULL,
    comentario_pai_id VARCHAR(36) NULL,
    score INT DEFAULT 0,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topico_id) REFERENCES topicos(id) ON DELETE CASCADE,
    FOREIGN KEY (comentario_pai_id) REFERENCES comentarios(id) ON DELETE CASCADE,
    FOREIGN KEY (autor_id) REFERENCES utilizadores(id)
);

CREATE TABLE votos (
    id VARCHAR(36) PRIMARY KEY,
    utilizador_id VARCHAR(36) NOT NULL,
    entidade_id VARCHAR(36) NOT NULL,
    tipo_entidade VARCHAR(30) NOT NULL,
    tipo_voto VARCHAR(10) NOT NULL,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (utilizador_id, entidade_id, tipo_entidade),
    INDEX idx_votos_entidade (entidade_id, tipo_entidade),
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE
);

CREATE TABLE conteudos (
    id VARCHAR(36) PRIMARY KEY,
    titulo VARCHAR(180) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(30) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    tags JSON NOT NULL,
    url_midia VARCHAR(500),
    corpo_texto TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    is_exclusivo BOOLEAN DEFAULT FALSE,
    autor_id VARCHAR(36) NOT NULL,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) REFERENCES utilizadores(id)
);

CREATE TABLE subscricoes (
    id VARCHAR(36) PRIMARY KEY,
    utilizador_id VARCHAR(36) NOT NULL,
    conteudo_id VARCHAR(36) NULL,
    forum_id VARCHAR(36) NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_fim DATETIME NULL,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE CASCADE,
    FOREIGN KEY (forum_id) REFERENCES foruns(id) ON DELETE CASCADE
);

CREATE TABLE salas_quiz (
    id VARCHAR(36) PRIMARY KEY,
    forum_id VARCHAR(36) NOT NULL,
    conteudo_id VARCHAR(36) NULL,
    limite_utilizadores INT NOT NULL DEFAULT 1,
    tempo_limite_ms BIGINT NOT NULL,
    pontos_base INT NOT NULL,
    estado VARCHAR(30) NOT NULL,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (forum_id) REFERENCES foruns(id) ON DELETE CASCADE,
    FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE SET NULL
);

CREATE TABLE perguntas_quiz (
    id VARCHAR(36) PRIMARY KEY,
    sala_id VARCHAR(36) NOT NULL,
    conteudo_id VARCHAR(36) NULL,
    enunciado TEXT NOT NULL,
    alternativas JSON NOT NULL,
    resposta_correta VARCHAR(255) NOT NULL,
    ordem INT NOT NULL,
    FOREIGN KEY (sala_id) REFERENCES salas_quiz(id) ON DELETE CASCADE,
    FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE SET NULL
);

CREATE TABLE participantes_sala (
    id VARCHAR(36) PRIMARY KEY,
    sala_id VARCHAR(36) NOT NULL,
    utilizador_id VARCHAR(36) NOT NULL,
    pontuacao_acumulada INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    data_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sala_id, utilizador_id),
    FOREIGN KEY (sala_id) REFERENCES salas_quiz(id) ON DELETE CASCADE,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE
);

CREATE TABLE respostas_quiz (
    id VARCHAR(36) PRIMARY KEY,
    sala_id VARCHAR(36) NOT NULL,
    pergunta_id VARCHAR(36) NOT NULL,
    utilizador_id VARCHAR(36) NOT NULL,
    resposta_enviada VARCHAR(255) NOT NULL,
    tempo_gasto_ms BIGINT NOT NULL,
    pontuacao_calculada INT NOT NULL,
    correta BOOLEAN NOT NULL,
    data_resposta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (pergunta_id, utilizador_id),
    FOREIGN KEY (sala_id) REFERENCES salas_quiz(id) ON DELETE CASCADE,
    FOREIGN KEY (pergunta_id) REFERENCES perguntas_quiz(id) ON DELETE CASCADE,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE
);

CREATE TABLE notificacoes (
    id VARCHAR(36) PRIMARY KEY,
    destinatario_id VARCHAR(36) NOT NULL,
    remetente_id VARCHAR(36) NOT NULL,
    tipo_evento VARCHAR(50) NOT NULL,
    mensagem TEXT NOT NULL,
    entidade_alvo_id VARCHAR(36) NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_criacao DATETIME NOT NULL,
    FOREIGN KEY (destinatario_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    FOREIGN KEY (remetente_id) REFERENCES utilizadores(id) ON DELETE CASCADE
);
