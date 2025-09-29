var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/validators.ts
var onlyDigits = (s) => (s || "").replace(/\D+/g, "");
function isCPF(input) {
  const cpf = onlyDigits(input);
  if (!cpf || cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (base, fac) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) sum += parseInt(base[i], 10) * fac--;
    const rest = sum * 10 % 11;
    return rest === 10 ? 0 : rest;
  };
  const d1 = calc(cpf.slice(0, 9), 10);
  const d2 = calc(cpf.slice(0, 10), 11);
  return d1 === parseInt(cpf[9], 10) && d2 === parseInt(cpf[10], 10);
}
function isCNPJ(input) {
  const cnpj = onlyDigits(input);
  if (!cnpj || cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = (base) => {
    const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < base.length; i++) sum += parseInt(base[i], 10) * weights[i + (weights.length - base.length)];
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  const d1 = calc(cnpj.slice(0, 12));
  const d2 = calc(cnpj.slice(0, 13));
  return d1 === parseInt(cnpj[12], 10) && d2 === parseInt(cnpj[13], 10);
}
function isCEP(input) {
  const cep = onlyDigits(input);
  return cep.length === 8;
}
function isPhoneBR(input) {
  const d = onlyDigits(input);
  if (d.length === 10) return true;
  if (d.length === 11) return d[2] === "9";
  return false;
}
function isPIS(input) {
  const d = onlyDigits(input);
  if (d.length !== 11) return false;
  const w = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d[i], 10) * w[i];
  const rest = sum % 11;
  const dv = rest < 2 ? 0 : 11 - rest;
  return dv === parseInt(d[10], 10);
}
function isRENAVAM(input) {
  let d = onlyDigits(input);
  if (d.length === 9) d = "00" + d;
  if (d.length !== 11) return false;
  const base = d.slice(0, 10).split("").reverse();
  const weights = [2, 3, 4, 5, 6, 7, 8, 9];
  let sum = 0;
  for (let i = 0; i < base.length; i++) sum += parseInt(base[i], 10) * weights[i % weights.length];
  const mod = sum % 11;
  const dv = mod === 0 || mod === 1 ? 0 : 11 - mod;
  return dv === parseInt(d[10], 10);
}
function isCNH(input) {
  const d = onlyDigits(input);
  if (d.length !== 11) return false;
  const calc = (wStart) => {
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(d[i], 10) * (wStart - i);
    let rest = sum % 11;
    return rest > 9 ? 0 : rest;
  };
  const d1 = calc(9);
  const d2 = (function() {
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(d[i], 10) * (1 + i);
    let rest = sum % 11;
    return rest > 9 ? 0 : rest;
  })();
  return d1 === parseInt(d[9], 10) && d2 === parseInt(d[10], 10);
}
function isPlateBR(input) {
  const s = (input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return /^[A-Z]{3}\d{4}$/.test(s) || /^[A-Z]{3}\d[A-Z]\d{2}$/.test(s);
}

// src/formatters.ts
function formatBRL(value, opts = {}) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", ...opts }).format(value);
}
var maskCPF = (v) => {
  const d = onlyDigits(v).slice(0, 11);
  return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};
var maskCNPJ = (v) => {
  const d = onlyDigits(v).slice(0, 14);
  return d.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};
var maskCEP = (v) => {
  const d = onlyDigits(v).slice(0, 8);
  return d.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
};
var maskPhoneBR = (v) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim().replace(/-$/, "");
  }
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim().replace(/-$/, "");
};
var maskPIS = (v) => {
  const d = onlyDigits(v).slice(0, 11);
  return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{5})(\d)/, "$1.$2").replace(/(\d{5})(\d{1,2})$/, "$1-$2");
};
var maskRENAVAM = (v) => {
  let d = onlyDigits(v).slice(0, 11);
  if (d.length === 9) d = "00" + d;
  if (d.length <= 9) return d;
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4").replace(/-$/, "");
};
var maskPlate = (v) => (v || "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 8);

// src/cache.ts
var DEFAULT_TTL_MS = 1e3 * 60 * 5;
var SimpleCache = class {
  constructor(defaultTtl = DEFAULT_TTL_MS) {
    this.defaultTtl = defaultTtl;
    this.store = /* @__PURE__ */ new Map();
  }
  get(key) {
    const e = this.store.get(key);
    if (!e) return void 0;
    if (Date.now() > e.expiresAt) {
      this.store.delete(key);
      return void 0;
    }
    return e.value;
  }
  set(key, value, ttlMs = this.defaultTtl) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
  has(key) {
    return this.get(key) !== void 0;
  }
  delete(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
};
var globalCache = new SimpleCache();

// src/providers.ts
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
var providers = {
  async fetchCEP(raw) {
    const cep = onlyDigits(raw);
    const key = `cep:${cep}`;
    const cached = globalCache.get(key);
    if (cached) return cached;
    try {
      const data = await fetchJson(`https://brasilapi.com.br/api/cep/v2/${cep}`);
      const out = {
        cep: (data.cep || cep).replace(/\D/g, ""),
        state: data.state || data.uf,
        city: data.city || data.localidade,
        neighborhood: data.neighborhood || data.bairro,
        street: data.street || data.logradouro,
        service: "brasilapi",
        uf: data.state || data.uf
      };
      globalCache.set(key, out);
      return out;
    } catch {
    }
    try {
      const data = await fetchJson(`https://viacep.com.br/ws/${cep}/json/`);
      if (data.erro) throw new Error("CEP n\xE3o encontrado");
      const out = {
        cep: (data.cep || cep).replace(/\D/g, ""),
        state: data.uf,
        city: data.localidade,
        neighborhood: data.bairro,
        street: data.logradouro,
        service: "viacep",
        uf: data.uf
      };
      globalCache.set(key, out);
      return out;
    } catch {
    }
    throw new Error("Falha ao buscar CEP em BrasilAPI e ViaCEP");
  },
  async fetchCNPJ(raw) {
    const cnpj = onlyDigits(raw);
    const key = `cnpj:${cnpj}`;
    const cached = globalCache.get(key);
    if (cached) return cached;
    try {
      const data = await fetchJson(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      globalCache.set(key, data);
      return data;
    } catch {
    }
    throw new Error("Falha ao buscar CNPJ (BrasilAPI)");
  }
};

// src/boleto.ts
function mod10Bloco(bloco) {
  let sum = 0, mult = 2;
  for (let i = bloco.length - 1; i >= 0; i--) {
    let n = parseInt(bloco[i], 10) * mult;
    if (n > 9) n = Math.floor(n / 10) + n % 10;
    sum += n;
    mult = mult === 2 ? 1 : 2;
  }
  const dv = (10 - sum % 10) % 10;
  return dv;
}
function barcodeFromLinhaBancario(d) {
  const campo1 = d.slice(0, 9);
  const dv1 = d.slice(9, 10);
  const campo2 = d.slice(10, 20);
  const dv2 = d.slice(20, 21);
  const campo3 = d.slice(21, 31);
  const dv3 = d.slice(31, 32);
  const dvG = d.slice(32, 33);
  const fator = d.slice(33, 37);
  const valor = d.slice(37, 47);
  const bancoMoeda = campo1.slice(0, 4);
  const campoLivre = campo1.slice(4) + campo2 + campo3;
  return bancoMoeda + dvG + fator + valor + campoLivre;
}
function fatorToDate(fator) {
  const n = parseInt(fator, 10);
  if (!Number.isFinite(n) || n === 0) return void 0;
  const base = new Date(1997, 9, 7);
  const dt = new Date(base.getTime() + n * 864e5);
  return dt;
}
function isValidBoletoLinhaDigitavel(input) {
  const d = onlyDigits(input);
  if (d.length === 47) {
    const c1 = d.slice(0, 9), dv1 = parseInt(d.slice(9, 10), 10);
    const c2 = d.slice(10, 20), dv2 = parseInt(d.slice(20, 21), 10);
    const c3 = d.slice(21, 31), dv3 = parseInt(d.slice(31, 32), 10);
    return mod10Bloco(c1) === dv1 && mod10Bloco(c2) === dv2 && mod10Bloco(c3) === dv3;
  }
  return false;
}
function parseBoleto(input) {
  const d = onlyDigits(input);
  const out = { barCode: "", isValid: false, type: "desconhecido" };
  if (d.length === 47) {
    out.type = "bancario";
    const valid = isValidBoletoLinhaDigitavel(d);
    out.isValid = valid;
    const bar = barcodeFromLinhaBancario(d);
    out.barCode = bar;
    const fator = bar.slice(5, 9);
    const valorStr = bar.slice(9, 19);
    const valor = parseInt(valorStr, 10);
    if (!isNaN(valor) && valor > 0) out.amount = valor / 100;
    const dt = fatorToDate(fator);
    if (dt) out.expirationDate = dt;
    return out;
  }
  if (d.length === 48) {
    out.type = "concessionaria";
    out.barCode = d;
    out.refModulo = detectConcessionariaModulo(d);
    const blocos = [0, 12, 24, 36].map((i) => d.slice(i, i + 12));
    const valids = blocos.map((b) => {
      const base = b.slice(0, 11);
      const dv = parseInt(b.slice(11, 12), 10);
      const calc = out.refModulo === 10 ? mod10Bloco(base) : mod11Bloco(base);
      return calc === dv;
    });
    out.isValid = valids.every(Boolean);
    return out;
  }
  out.errors = ["Tamanho inv\xE1lido (esperado 47 ou 48 d\xEDgitos)"];
  return out;
}
function mod11Bloco(bloco) {
  let sum = 0, weight = 2;
  for (let i = bloco.length - 1; i >= 0; i--) {
    sum += parseInt(bloco[i], 10) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const resto = sum % 11;
  const dv = resto === 0 || resto === 1 ? 0 : 11 - resto;
  return dv;
}
function detectConcessionariaModulo(d) {
  const ind = parseInt(d[2], 10);
  return ind === 6 || ind === 7 ? 10 : 11;
}

// src/ibge.ts
async function fetchMunicipios(uf, ttlMs = 1e3 * 60 * 60) {
  const key = `ibge:municipios:${uf.toUpperCase()}`;
  const cached = globalCache.get(key);
  if (cached) return cached;
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha IBGE");
  const data = await res.json();
  globalCache.set(key, data, ttlMs);
  return data;
}

// src/vehicle.ts
var vehicle_exports = {};
__export(vehicle_exports, {
  isPlateBR: () => isPlateBR,
  maskPlate: () => maskPlate
});

// src/ie.ts
function isDigits(s) {
  return /^\d+$/.test(s);
}
var rules = {
  AC: (ie) => isDigits(ie) && ie.length in { 13: 1 },
  AL: (ie) => isDigits(ie) && ie.length === 9,
  AP: (ie) => isDigits(ie) && ie.length === 9,
  AM: (ie) => isDigits(ie) && ie.length === 9,
  BA: (ie) => isDigits(ie) && (ie.length === 8 || ie.length === 9),
  CE: (ie) => isDigits(ie) && ie.length === 9,
  DF: (ie) => isDigits(ie) && ie.length === 13,
  ES: (ie) => isDigits(ie) && ie.length === 9,
  GO: (ie) => isDigits(ie) && ie.length === 9,
  MA: (ie) => isDigits(ie) && ie.length === 9,
  MT: (ie) => isDigits(ie) && ie.length === 11,
  MS: (ie) => isDigits(ie) && ie.length === 9,
  MG: (ie) => isDigits(ie) && ie.length === 13,
  PA: (ie) => isDigits(ie) && ie.length === 9,
  PB: (ie) => isDigits(ie) && ie.length === 9,
  PR: (ie) => isDigits(ie) && ie.length === 10,
  PE: (ie) => isDigits(ie) && (ie.length === 9 || ie.length === 14),
  PI: (ie) => isDigits(ie) && ie.length === 9,
  RJ: (ie) => isDigits(ie) && ie.length === 8,
  RN: (ie) => isDigits(ie) && (ie.length === 9 || ie.length === 10),
  RS: (ie) => isDigits(ie) && ie.length === 10,
  RO: (ie) => isDigits(ie) && (ie.length === 9 || ie.length === 14),
  RR: (ie) => isDigits(ie) && ie.length === 9,
  SC: (ie) => isDigits(ie) && ie.length === 9,
  SP: (ie) => {
    const s = ie.toUpperCase();
    if (s.length === 12) {
      if (/^P\d{11}$/.test(s)) return true;
      if (/^\d{12}$/.test(s)) return true;
    }
    return false;
  },
  SE: (ie) => isDigits(ie) && ie.length === 9,
  TO: (ie) => isDigits(ie) && (ie.length === 9 || ie.length === 11)
};
function isIE(uf, ie) {
  const clean = (ie || "").replace(/[.\-\/\s]/g, "");
  const UF = (uf || "").toUpperCase();
  if (!(UF in rules)) return false;
  return rules[UF](clean);
}
function dvRJ(base7) {
  const weights = [2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += parseInt(base7[i], 10) * weights[i];
  let dv = 11 - sum % 11;
  if (dv >= 10) dv = 0;
  return dv;
}
function validateRJ(ie) {
  if (!rules["RJ"](ie)) return false;
  const d = ie;
  const dv = dvRJ(d.slice(0, 7));
  return dv === parseInt(d[7], 10);
}
function dvPR(base8) {
  const weights = [3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += parseInt(base8[i], 10) * weights[i];
  let mod = sum % 11;
  let dv = 11 - mod;
  if (dv >= 10) dv = 0;
  return dv;
}
function validatePR(ie) {
  if (!rules["PR"](ie)) return false;
  const d = ie;
  const dv1 = dvPR(d.slice(0, 8));
  const dv2 = dvPR(d.slice(0, 8) + String(dv1));
  return dv1 === parseInt(d[8], 10) && dv2 === parseInt(d[9], 10);
}
function isIEWithChecksum(uf, ie) {
  const clean = (ie || "").replace(/[.\-\/\s]/g, "");
  const UF = (uf || "").toUpperCase();
  if (!isIE(UF, clean)) return false;
  switch (UF) {
    case "RJ":
      return validateRJ(clean);
    case "PR":
      return validatePR(clean);
    case "SP":
      return validateSPChecksum(clean);
    case "MG":
      return validateMGChecksum(clean);
    default:
      return true;
  }
}
function dvSP1(first8) {
  const weights = [1, 3, 4, 5, 6, 7, 8, 10];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += parseInt(first8[i], 10) * weights[i];
  const r = sum % 11;
  return r % 10;
}
function dvSP2(first11) {
  const weights = [3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 11; i++) sum += parseInt(first11[i], 10) * weights[i];
  const r = sum % 11;
  return r % 10;
}
function validateSPChecksum(ie) {
  if (!/^\d{12}$/.test(ie)) return true;
  const d = ie;
  const d1 = dvSP1(d.slice(0, 8));
  if (d1 !== parseInt(d[8], 10)) return false;
  const d2 = dvSP2(d.slice(0, 11));
  return d2 === parseInt(d[11], 10);
}
function dvMG1(first11) {
  const base12 = first11.slice(0, 3) + "0" + first11.slice(3);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const w = i % 2 === 0 ? 1 : 2;
    const p = parseInt(base12[i], 10) * w;
    sum += Math.floor(p / 10) + p % 10;
  }
  return (10 - sum % 10) % 10;
}
function dvMG2(first12) {
  const weights = [3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(first12[i], 10) * weights[i];
  const mod = sum % 11;
  const dv = 11 - mod;
  return dv === 10 || dv === 11 ? 0 : dv;
}
function validateMGChecksum(ie) {
  if (!/^\d{13}$/.test(ie)) return false;
  const base11 = ie.slice(0, 11);
  const d1 = dvMG1(base11);
  if (d1 !== parseInt(ie[11], 10)) return false;
  const d2 = dvMG2(base11 + String(d1));
  return d2 === parseInt(ie[12], 10);
}

// src/data/ddd.json
var ddd_default = {
  "11": "SP - S\xE3o Paulo",
  "21": "RJ - Rio de Janeiro",
  "31": "MG - Belo Horizonte",
  "41": "PR - Curitiba",
  "61": "DF - Bras\xEDlia",
  "71": "BA - Salvador",
  "85": "CE - Fortaleza",
  "51": "RS - Porto Alegre"
};

// src/data/banks.json
var banks_default = [
  {
    code: "001",
    name: "Banco do Brasil S.A."
  },
  {
    code: "033",
    name: "Banco Santander (Brasil) S.A."
  },
  {
    code: "104",
    name: "Caixa Econ\xF4mica Federal"
  },
  {
    code: "237",
    name: "Banco Bradesco S.A."
  },
  {
    code: "341",
    name: "Ita\xFA Unibanco S.A."
  },
  {
    code: "260",
    name: "Nu Pagamentos S.A. (Nubank)"
  },
  {
    code: "077",
    name: "Banco Inter S.A."
  },
  {
    code: "212",
    name: "Banco Original S.A."
  }
];

// docs/br-entry.ts
var datasets = { ddd: ddd_default, banks: banks_default };
var br_entry_default = { datasets };
export {
  datasets,
  br_entry_default as default,
  fetchMunicipios,
  formatBRL,
  isCEP,
  isCNH,
  isCNPJ,
  isCPF,
  isIE,
  isIEWithChecksum,
  isPIS,
  isPhoneBR,
  isPlateBR,
  isRENAVAM,
  isValidBoletoLinhaDigitavel,
  maskCEP,
  maskCNPJ,
  maskCPF,
  maskPIS,
  maskPhoneBR,
  maskPlate,
  maskRENAVAM,
  onlyDigits,
  parseBoleto,
  providers,
  vehicle_exports as vehicle
};
