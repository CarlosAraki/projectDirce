# 📡 API de Monitoramento Tuya com Docker

## 🌟 Visão Geral
Esta API monitora dispositivos Tuya (como alarmes inteligentes) verificando seu status periodicamente e expondo endpoints para consulta. O sistema é containerizado com Docker para fácil implantação.

## 🛠️ Tecnologias Utilizadas
- **Node.js** (v20 ou superior)
- **Express** (Servidor web)
- **Tuya Connector** (Conexão com dispositivos Tuya)
- **node-cron** (Agendamento de tarefas)
- **Docker** (Containerização)
- **Docker Compose** (Orquestração de containers)

## 🔌 Pré-requisitos
- Docker instalado
- Docker Compose instalado
- Conta developer Tuya com:
  - Access Key
  - Secret Key
  - Device ID

## 🚀 Instalação

### 1. Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto com:

```env
TUYA_BASE_URL=https://openapi.tuyaus.com
TUYA_ACCESS_KEY=seu_access_key
TUYA_SECRET_KEY=seu_secret_key
TUYA_DEVICE_ID=seu_device_id
PORT=3001
```

### 2. Build e Execução
Execute o seguinte comando:

```bash
docker-compose up -d --build
```

## 🐳 Estrutura do Docker Compose
O sistema consiste em três serviços:

1. **API Node.js** (backendTuya)
   - Porta: 3001
   - Build a partir do Dockerfile
   - Depende das variáveis do .env

2. **n8n** (Automação/workflows)
   - Porta: 5678
   - Volume persistente para dados
   - Interface web para gerenciamento

3. **Ollama** (Modelos de IA local)
   - Porta: 11434
   - Monta modelos locais
   - Configuração customizada via script

## 📡 Endpoints da API

### GET `/status`
- **Descrição**: Verifica se a API está online
- **Resposta**:
  ```json
  {"status":"API ativa"}
  ```

### GET `/device-status`
- **Descrição**: Retorna o status atual do dispositivo Tuya
- **Resposta** (Exemplo):
  ```json
  {
    "status": {
      "result": [{
        "code": "master_mode",
        "value": "armed"
      }],
      "success": true
    }
  }
  ```

### GET `/debug-env` (Debug)
- **Descrição**: Verifica se as variáveis de ambiente foram carregadas corretamente

## ⏱ Funcionalidades Agendadas
- Verificação automática do status do dispositivo a cada 10 segundos
- Logs no console quando o modo "armed" é detectado

## 🛠️ Estrutura de Arquivos
```
.
├── backendTuya/
│   ├── app.js            # Código principal da API
│   └── Dockerfile        # Configuração do container Node
│   └── .env              # CVariáveis de ambiente
├── ollama/
│   └── run_ollama.sh     # Script de inicialização do Ollama
├── docker-compose.yml    # Orquestração dos serviços
```

## 🐛 Solução de Problemas

### Erro "ERR_INVALID_ARG_TYPE"
- Verifique se as credenciais Tuya estão corretas no `.env`
- Confira se o `.env` está na pasta raiz

### Dispositivo não responde
- Verifique se o Device ID está correto
- Confira se o dispositivo está online no app Tuya

### Logs dos Containers
```bash
docker-compose logs -f
```
