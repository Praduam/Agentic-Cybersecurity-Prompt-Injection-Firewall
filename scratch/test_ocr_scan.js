import { createWorker } from 'tesseract.js';
import { scanInputWithFirewall } from '../src/utils/detectorEngine.ts';

async function testOcr() {
  console.log('=== STARTING OCR PAYLOAD TEST ===');
  console.log('Loading Tesseract worker...');
  const worker = await createWorker('eng');
  
  console.log('Recognizing text in sample_ocr_payload.jpg...');
  const ret = await worker.recognize('./sample_ocr_payload.jpg');
  await worker.terminate();

  const extractedText = ret.data.text.trim();
  console.log('\n--- EXTRACTED OCR TEXT ---');
  console.log(extractedText);

  console.log('\n--- RUNNING AEGISPROMPT FIREWALL SCAN ---');
  const scanResult = scanInputWithFirewall(extractedText, 'OCR_TEXT');
  console.log(JSON.stringify(scanResult, null, 2));
}

testOcr().catch(console.error);
