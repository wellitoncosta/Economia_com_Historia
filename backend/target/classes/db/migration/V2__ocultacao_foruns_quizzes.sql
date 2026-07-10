ALTER TABLE foruns
    ADD COLUMN is_oculto BOOLEAN DEFAULT FALSE;

ALTER TABLE salas_quiz
    ADD COLUMN criador_id VARCHAR(36) NULL,
    ADD COLUMN is_oculto BOOLEAN DEFAULT FALSE,
    ADD CONSTRAINT fk_salas_quiz_criador FOREIGN KEY (criador_id) REFERENCES utilizadores(id) ON DELETE SET NULL;
