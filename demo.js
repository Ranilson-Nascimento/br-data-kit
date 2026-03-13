import * as br from './br-data-kit.browser.js';

function $(id){return document.getElementById(id)}

// Tema (dark/light) com persistência
const themeBtn = document.getElementById('theme-toggle-btn');
const storedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('br-data-kit-theme') : null;
if (storedTheme === 'light') {
  document.body.classList.add('theme-light');
  if (themeBtn) themeBtn.textContent = '☀️';
}
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('theme-light');
    themeBtn.textContent = isLight ? '☀️' : '🌙';
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('br-data-kit-theme', isLight ? 'light' : 'dark');
    }
  });
}

// Tabs
const tabs = document.querySelectorAll('[data-tab-target]');
const tabPanels = document.querySelectorAll('[data-tab]');
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-tab-target');
    tabs.forEach(b => b.classList.remove('tab-active'));
    btn.classList.add('tab-active');
    tabPanels.forEach(panel => {
      panel.classList.toggle('hidden', panel.getAttribute('data-tab') !== target);
    });
  });
});
// Estado inicial das abas (somente aba "Visão geral" visível)
const initialTab = document.querySelector('[data-tab-target].tab-active');
if (initialTab) {
  const target = initialTab.getAttribute('data-tab-target');
  tabPanels.forEach(panel => {
    panel.classList.toggle('hidden', panel.getAttribute('data-tab') !== target);
  });
}

// Botões de copiar código
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const id = btn.getAttribute('data-copy');
    const pre = id ? document.getElementById(id) : null;
    if (!pre) return;
    try {
      await navigator.clipboard.writeText(pre.textContent || '');
      const original = btn.textContent;
      btn.textContent = 'Copiado!';
      setTimeout(() => { btn.textContent = original; }, 1200);
    } catch {
      btn.textContent = 'Erro';
      setTimeout(() => { btn.textContent = 'Copiar'; }, 1200);
    }
  });
});

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

// PIS
if (br.maskPIS && br.isPIS) {
  $('pis-mask').addEventListener('click', () => {
    $('pis-result').textContent = br.maskPIS($('pis-in').value || '');
  });
  $('pis-validate').addEventListener('click', () => {
    $('pis-result').textContent = br.isPIS($('pis-in').value || '') ? 'PIS válido ✅' : 'PIS inválido ❌';
  });
}

// RENAVAM
if (br.maskRENAVAM && br.isRENAVAM) {
  $('renavam-mask').addEventListener('click', () => {
    $('renavam-result').textContent = br.maskRENAVAM($('renavam-in').value || '');
  });
  $('renavam-validate').addEventListener('click', () => {
    $('renavam-result').textContent = br.isRENAVAM($('renavam-in').value || '') ? 'RENAVAM válido ✅' : 'RENAVAM inválido ❌';
  });
}

// CNH
if (br.isCNH) {
  $('cnh-validate').addEventListener('click', () => {
    $('cnh-result').textContent = br.isCNH($('cnh-in').value || '') ? 'CNH válida ✅' : 'CNH inválida ❌';
  });
}

// Placa
if (br.isPlateBR && br.maskPlate) {
  $('plate-mask').addEventListener('click', () => {
    $('plate-result').textContent = br.maskPlate($('plate-in').value || '');
  });
  $('plate-validate').addEventListener('click', () => {
    $('plate-result').textContent = br.isPlateBR($('plate-in').value || '') ? 'Placa válida ✅' : 'Placa inválida ❌';
  });
}

// CEP
$('cep-search').addEventListener('click', async () => {
  const raw = $('cep-in').value || '';
  $('cep-result').textContent = 'Buscando CEP...';
  try {
    const res = await providers.fetchCEP(raw);
    const provider = res.service || (res.uf ? 'viacep' : 'desconhecido');
    $('cep-result').textContent =
      `Provider: ${provider}\n` +
      JSON.stringify(res, null, 2);
  } catch (err) {
    $('cep-result').textContent = `Erro ao buscar CEP: ${String(err)}`;
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
    try {
      const info = br.parseBoleto(boletoInput.value || '');
      let summary = '';
      if (info.amount != null && typeof formatBRL === 'function') {
        summary += `Valor: ${formatBRL(info.amount)}\n`;
      }
      if (info.expirationDate) {
        const d = new Date(info.expirationDate);
        summary += `Vencimento: ${d.toLocaleDateString('pt-BR')}\n`;
      }
      summary += `Tipo: ${info.type}\n`;
      summary += `Válido: ${info.isValid ? 'sim ✅' : 'não ❌'}\n\n`;
      boletoRes.textContent = summary + JSON.stringify(info, null, 2);
    } catch (e) {
      boletoRes.textContent = String(e);
    }
  });
  boletoValidateBtn.addEventListener('click', () => {
    try {
      boletoRes.textContent = br.isValidBoletoLinhaDigitavel(boletoInput.value || '')
        ? 'Linha digitável válida ✅'
        : 'Linha digitável inválida ❌';
    } catch (e) {
      boletoRes.textContent = String(e);
    }
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

// Formulário Brasil (demo visual, sem React)
const formCep = document.getElementById('form-cep');
const formCepResult = document.getElementById('form-cep-result');
const formCnpj = document.getElementById('form-cnpj');
const formCnpjResult = document.getElementById('form-cnpj-result');
const formPhone = document.getElementById('form-phone');
const formPhoneResult = document.getElementById('form-phone-result');
const formMoney = document.getElementById('form-money');
const formMoneyResult = document.getElementById('form-money-result');

if (formCep && formCepResult && providers.fetchCEP) {
  formCep.addEventListener('blur', async () => {
    const raw = formCep.value || '';
    formCepResult.textContent = 'Buscando endereço...';
    try {
      const res = await providers.fetchCEP(raw);
      formCepResult.textContent = `${res.street || ''} - ${res.city} / ${res.state}`;
    } catch (e) {
      formCepResult.textContent = `Erro CEP: ${String(e)}`;
    }
  });
}

if (formCnpj && formCnpjResult && br.providers && br.providers.fetchCNPJ) {
  formCnpj.addEventListener('blur', async () => {
    const raw = formCnpj.value || '';
    formCnpjResult.textContent = 'Buscando empresa...';
    try {
      const res = await br.providers.fetchCNPJ(raw);
      formCnpjResult.textContent = res.razao_social || res.nome_fantasia || 'CNPJ encontrado';
    } catch (e) {
      formCnpjResult.textContent = `Erro CNPJ: ${String(e)}`;
    }
  });
}

if (formPhone && formPhoneResult && typeof maskPhoneBR === 'function' && typeof isPhoneBR === 'function') {
  formPhone.addEventListener('input', () => {
    const raw = formPhone.value || '';
    const masked = maskPhoneBR(raw);
    formPhone.value = masked;
    formPhoneResult.textContent = isPhoneBR(raw) ? 'Telefone válido ✅' : 'Telefone inválido ❌';
  });
}

if (formMoney && formMoneyResult && typeof formatBRL === 'function') {
  formMoney.addEventListener('input', () => {
    const raw = formMoney.value || '';
    const num = parseFloat(raw.replace(',', '.')) || 0;
    formMoneyResult.textContent = formatBRL(num);
  });
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
const playCepBtn = document.getElementById('play-example-cep');
const playCnpjBtn = document.getElementById('play-example-cnpj');
const playBrlBtn = document.getElementById('play-example-brl');
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

// Templates de exemplos rápidos no playground
if (playCepBtn) {
  playCepBtn.addEventListener('click', () => {
    if (exportKeys.includes('providers')) {
      playSelect.value = 'providers.fetchCEP';
      playArgs.value = '["01001000"]';
    } else if (exportKeys.includes('fetchCEP')) {
      playSelect.value = 'fetchCEP';
      playArgs.value = '["01001000"]';
    }
    playRes.textContent = 'Clique em Run para executar o exemplo de CEP.';
  });
}
if (playCnpjBtn) {
  playCnpjBtn.addEventListener('click', () => {
    if (exportKeys.includes('providers')) {
      playSelect.value = 'providers.fetchCNPJ';
      playArgs.value = '["27865757000102"]';
    } else if (exportKeys.includes('fetchCNPJ')) {
      playSelect.value = 'fetchCNPJ';
      playArgs.value = '["27865757000102"]';
    }
    playRes.textContent = 'Clique em Run para executar o exemplo de CNPJ.';
  });
}
if (playBrlBtn) {
  playBrlBtn.addEventListener('click', () => {
    if (exportKeys.includes('formatBRL')) {
      playSelect.value = 'formatBRL';
      playArgs.value = '[1234.56]';
      playRes.textContent = 'Clique em Run para formatar 1234.56 em BRL.';
    }
  });
}