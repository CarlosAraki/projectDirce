import express from 'express';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import { TuyaContext } from "@tuya/tuya-connector-nodejs";
import dotenv from 'dotenv';

// Configuração do ambiente
dotenv.config();

const app = express();

const context = new TuyaContext({
  baseUrl: process.env.TUYA_BASE_URL || 'https://openapi.tuyaus.com',
  accessKey: process.env.TUYA_ACCESS_KEY,
  secretKey: process.env.TUYA_SECRET_KEY,
});

const device_id = process.env.TUYA_DEVICE_ID;

// Middleware
app.use(bodyParser.json());

// Rotas
app.get('/status', (req, res) => {
  res.json({ status: 'API ativa' });
});

app.get('/device-status', async (req, res) => {
  try {
    const status = await startMonitoring(device_id,true);
    res.json({ status });
  } catch (error) {
    console.error('Erro ao verificar status do dispositivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para verificar o status do dispositivo retorna true quando o alarme está ativo
app.get('/device-status-panic', async (req, res) => {
  try {
    const status = await startMonitoring(device_id);
    res.json({ status });
  } catch (error) {
    console.error('Erro ao verificar status do dispositivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verificação a cada 10 segundos (*/10 * * * * *) 
// deprecated, use o endpoint /device-status-panic pelo cron da n8n 
// cron.schedule('*/10 * * * * *', async () => {
//   console.log('\n--- Verificação agendada iniciada ---');
//   try {
//     await startMonitoring(device_id);
//   } catch (error) {
//     console.error('Erro na verificação agendada:', error.message);
//   }
//   console.log('--- Verificação agendada concluída ---\n');
// });

// Função auxiliar modificada
async function startMonitoring(deviceID,allstatus = false) {
  console.log('Monitorando dispositivo:');
  const result = await context.deviceStatus.status({ device_id: deviceID });
  
  if (!result.success) {
    throw new Error('Dispositivo não respondeu corretamente');
  }
  
  // Passa o array completo de status
  if(allstatus){
    console.log('Status completo do dispositivo:', result.result);
    return result.result;
  }
  // Passa apenas o status do alarme
  const panic = await checkForPanic(result.result); 
  console.log('Resultado da verificação de pânico:', panic);
  return panic;
}

// Função de verificação melhorada
async function checkForPanic(statusArray) {
  console.log('Status recebido:', statusArray);
  
  const masterMode = statusArray.find(s => s.code === 'master_mode');
  
  if (masterMode) {
    console.log(`Modo encontrado: ${masterMode.value}`);
    
    if (masterMode.value === 'arm' || masterMode.value === 'sos' || masterMode.value === 'alarm') { // Altere para 'disarmed' se necessário
      console.log('MODE_ATIVO! - ALARME ARMADO');
      return true;
    } else {
      console.log('Alarme desarmado');
      return false;
    }
  } 
  else {
    console.log('Modo master_mode não encontrado nos status');
    return false;
  }
}

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
