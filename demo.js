import * as br from './br-data-kit.browser.js';

function $(id){return document.getElementById(id)}

// Use exported functions when available, otherwise fallback to built-ins
const isCPF = br.isCPF || ((v)=>false);
const maskCPF = br.maskCPF || ((v)=>v);
const isCNPJ = br.isCNPJ || (()=>false);
const maskCNPJ = br.maskCNPJ || ((v)=>v);
const isPhoneBR = br.isPhoneBR || (()=>false);
const maskPhoneBR = br.maskPhoneBR || ((v)=>v);
const formatBRL = br.formatBRL || ((n)=> new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(n)||0));
const providers = br.providers || { fetchCEP: async (r)=>{ throw new Error('providers.fetchCEP not available in bundle') } };

// Wire UI
$('cpf-mask').addEventListener('click', () => {
  $('cpf-result').textContent = maskCPF($('cpf-in').value || '');
});
$('cpf-validate').addEventListener('click', () => {
  $('cpf-result').textContent = isCPF($('cpf-in').value || '') ? 'CPF válido ✅' : 'Inválido ❌';
});

// CNPJ
$('cnpj-mask').addEventListener('click', () => {
  $('cnpj-result').textContent = maskCNPJ($('cnpj-in').value || '');
});
$('cnpj-validate').addEventListener('click', () => {
  $('cnpj-result').textContent = isCNPJ($('cnpj-in').value || '') ? 'CNPJ válido ✅' : 'Inválido ❌';
});

// Phone
$('phone-mask').addEventListener('click', () => {
  $('phone-result').textContent = maskPhoneBR($('phone-in').value || '');
});
$('phone-validate').addEventListener('click', () => {
  $('phone-result').textContent = isPhoneBR($('phone-in').value || '') ? 'Telefone válido ✅' : 'Inválido ❌';
});

// Money
$('money-format').addEventListener('click', () => {
  const v = parseFloat($('money-in').value || '0');
  $('money-result').textContent = formatBRL(v);
});

// CEP
$('cep-search').addEventListener('click', async () => {
  const raw = $('cep-in').value || '';
  $('cep-result').textContent = 'Buscando...';
  try {
    const res = await providers.fetchCEP(raw);
    $('cep-result').textContent = JSON.stringify(res, null, 2);
  } catch (err) {
    $('cep-result').textContent = String(err);
  }
});

// Add a small info box listing available exports
const info = document.createElement('pre');
info.className = 'result';
info.textContent = `Exported: ${Object.keys(br).join(', ')}`;
document.querySelector('.container').appendChild(info);

// Advanced features wiring
const boletoParseBtn = document.getElementById('boleto-parse');
const boletoValidateBtn = document.getElementById('boleto-validate');
const boletoInput = document.getElementById('boleto-in');
const boletoRes = document.getElementById('boleto-result');

if (br.parseBoleto) {
  boletoParseBtn.addEventListener('click', () => {
    try { boletoRes.textContent = JSON.stringify(br.parseBoleto(boletoInput.value||''), null, 2); }
    catch(e){ boletoRes.textContent = String(e); }
  });
  boletoValidateBtn.addEventListener('click', () => {
    try { boletoRes.textContent = br.isValidBoletoLinhaDigitavel(boletoInput.value||'') ? 'Válido ✅' : 'Inválido ❌'; }
    catch(e){ boletoRes.textContent = String(e); }
  });
} else {
  boletoRes.textContent = 'parseBoleto não disponível no bundle.';
}

// CNPJ lookup
const cnpjLookupBtn = document.getElementById('cnpj-lookup');
const cnpjLookupIn = document.getElementById('cnpj-lookup-in');
const cnpjLookupRes = document.getElementById('cnpj-lookup-result');
if (br.providers && br.providers.fetchCNPJ) {
  cnpjLookupBtn.addEventListener('click', async () => {
    cnpjLookupRes.textContent = 'Buscando...';
    try { const r = await br.providers.fetchCNPJ(cnpjLookupIn.value||''); cnpjLookupRes.textContent = JSON.stringify(r,null,2); }
    catch(e){ cnpjLookupRes.textContent = String(e); }
  });
} else {
  cnpjLookupRes.textContent = 'providers.fetchCNPJ não disponível neste bundle.';
}

// IBGE municipios
const ibgeBtn = document.getElementById('ibge-search');
const ibgeIn = document.getElementById('ibge-uf');
const ibgeRes = document.getElementById('ibge-result');
if (br.fetchMunicipios) {
  ibgeBtn.addEventListener('click', async () => {
    ibgeRes.textContent = 'Buscando...';
    try { const r = await br.fetchMunicipios(ibgeIn.value||''); ibgeRes.textContent = JSON.stringify(r.slice(0,200),null,2); }
    catch(e){ ibgeRes.textContent = String(e); }
  });
} else {
  ibgeRes.textContent = 'fetchMunicipios não disponível no bundle.';
}

// datasets
const datasetDdd = document.getElementById('dataset-ddd');
const datasetBanks = document.getElementById('dataset-banks');
if (br.datasets) {
  datasetDdd.textContent = JSON.stringify(br.datasets.ddd,null,2);
  datasetBanks.textContent = JSON.stringify(br.datasets.banks,null,2);
} else if (br.default && br.default.datasets) {
  datasetDdd.textContent = JSON.stringify(br.default.datasets.ddd,null,2);
  datasetBanks.textContent = JSON.stringify(br.default.datasets.banks,null,2);
} else {
  datasetDdd.textContent = 'datasets não disponível no bundle.';
  datasetBanks.textContent = 'datasets não disponível no bundle.';
}

// IE validation
const ieBtn = document.getElementById('ie-validate');
const ieUf = document.getElementById('ie-uf');
const ieIn = document.getElementById('ie-in');
const ieRes = document.getElementById('ie-result');
if (br.isIE) {
  ieBtn.addEventListener('click', () => {
    try { ieRes.textContent = br.isIE(ieUf.value||'', ieIn.value||'') ? 'Estrutural OK ✅' : 'Estrutura inválida ❌'; }
    catch(e){ ieRes.textContent = String(e); }
  });
} else {
  ieRes.textContent = 'isIE não disponível no bundle.';
}

// Playground
const playSelect = document.getElementById('play-fn');
const playArgs = document.getElementById('play-args');
const playRun = document.getElementById('play-run');
const playRes = document.getElementById('play-result');
const exportKeys = Object.keys(br).filter(k=> typeof (br[k]) === 'function');
exportKeys.forEach(k=>{ const o = document.createElement('option'); o.value = k; o.textContent = k; playSelect.appendChild(o); });
playRun.addEventListener('click', async () => {
  const fn = playSelect.value; let args = [];
  try { args = JSON.parse(playArgs.value || '[]'); } catch(e){ playRes.textContent = 'JSON inválido para argumentos'; return; }
  try {
    const res = await br[fn](...args);
    playRes.textContent = JSON.stringify(res, null, 2);
  } catch(e){ playRes.textContent = String(e); }
});