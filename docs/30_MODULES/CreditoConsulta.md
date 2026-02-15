# Sistema de Créditos de Consulta

## Visão Geral

O sistema de créditos controla o acesso a consultas de APIs pagas na plataforma. Os créditos são distribuídos hierarquicamente e reset mensalmente.

## Hierarquia de Distribuição

```
Admin → Franquia → Loja → Vendedor
```

Cada nível pode distribuir créditos para o nível inferior, respeitando seu saldo disponível.

---

## Campos de Controle

Cada entidade (franquias, lojas, usuarios) possui **3 campos**:

| Campo | Descrição |
|-------|-----------|
| `creditos_quota_mensal` | Quota fixa recebida do nível superior |
| `creditos_distribuidos` | Créditos dados para o nível inferior |
| `creditos_consumidos` | Créditos usados em consultas |

### Cálculo de Disponível

```
Disponível = quota_mensal - distribuidos - consumidos
```

---

## Regras de Negócio

### Distribuição (dar créditos)
- Só pode dar se tiver disponível
- O valor é **adicionado** à quota do destino
- O valor é **somado** aos distribuídos da origem

### Recolhimento (puxar créditos)
- Só pode recolher o que está **disponível** no destino
- NÃO pode recolher créditos já consumidos
- NÃO pode recolher créditos já distribuídos pelo destino

### Reset Mensal
- No dia configurado, `creditos_consumidos` é zerado em todas as entidades
- As quotas (`creditos_quota_mensal`) permanecem iguais
- Os distribuídos (`creditos_distribuidos`) permanecem iguais

---

## Exemplos

### Exemplo 1: Fluxo Normal

1. **Admin** define franquia com quota = 100
2. **Franquia** distribui 50 para Loja1
   - Franquia: quota=100, distribuidos=50, disponível=50
   - Loja1: quota=50, disponível=50
3. **Loja1** distribui 30 para Vendedor1
   - Loja1: quota=50, distribuidos=30, disponível=20
   - Vendedor1: quota=30, disponível=30
4. **Vendedor1** consome 10
   - Vendedor1: quota=30, consumidos=10, disponível=20

### Exemplo 2: Recolhimento

Continuando do exemplo acima:
- Loja1 quer recolher créditos do Vendedor1
- Vendedor1 tem: quota=30, distribuidos=0, consumidos=10
- **Disponível para recolher** = 30 - 0 - 10 = **20**
- Loja1 NÃO pode recolher os 10 consumidos

### Exemplo 3: Reset Mensal

No dia 1 do mês:
- Vendedor1: consumidos → 0, disponível volta a 30
- Loja1: consumidos → 0, disponível volta a 20
- Franquia: consumidos → 0, disponível volta a 50

---

## Funções SQL

| Função | Descrição |
|--------|-----------|
| `distribuir_creditos_loja(franquia_id, loja_id, qtd)` | Franquia dá créditos para loja |
| `recolher_creditos_loja(franquia_id, loja_id, qtd)` | Franquia puxa créditos da loja |
| `distribuir_creditos_vendedor(loja_id, usuario_id, qtd)` | Loja dá créditos para vendedor |
| `recolher_creditos_vendedor(loja_id, usuario_id, qtd)` | Loja puxa créditos do vendedor |
| `consumir_credito(usuario_id, tipo, dados)` | Consome 1 crédito e registra log |
| `reset_creditos_mensais()` | Zera consumidos de todas as entidades |

---

## Tabela de Logs

Toda consulta é registrada em `log_consumo_creditos`:

| Campo | Descrição |
|-------|-----------|
| `usuario_id` | Quem consumiu |
| `franquia_id` | Franquia associada |
| `loja_id` | Loja associada (se houver) |
| `tipo_consulta` | Nome da API/consulta |
| `creditos_consumidos` | Quantidade (geralmente 1) |
| `dados_consulta` | JSON com dados da consulta (CPF, CNPJ, etc) |
| `created_at` | Data/hora do consumo |

---

## Configuração

A tabela `configuracoes_sistema` contém:

| Campo | Descrição | Padrão |
|-------|-----------|--------|
| `dia_reset_creditos` | Dia do mês para reset (1-28) | 1 |
| `ultimo_reset` | Data do último reset executado | - |
