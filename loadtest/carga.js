import http from 'k6/http';
import { check, sleep, group } from 'k6';

// URL base do ambiente.
const BASE = __ENV.BASE_URL || 'http://localhost:8080';
// Número de usuários virtuais
const VUS = Number(__ENV.VUS || 10);

export const options = {
  stages: [
    { duration: '15s', target: VUS },   // Sobe a carga gradualmente
    { duration: '30s', target: VUS },   // Mantém a carga máxima estável
    { duration: '15s', target: 0 },     // Desaquecimento
  ],
  thresholds: {
    http_req_failed:   ['rate<0.01'],   // Meta: menos de 1% de requisições com falha
    http_req_duration: ['p(95)<500'],   // Meta: 95% das requisições devem responder abaixo de 500ms
  },
};

export default function () {
  // 1. Healthcheck (/ping)
  group('healthcheck', () => {
    const res = http.get(`${BASE}/ping`);
    check(res, { 'ping status 200': (r) => r.status === 200 });
  });

  // 2. Catálogo de Produtos
  group('catalog', () => {
    const res = http.get(`${BASE}/api/produtos`);
    check(res, { 'produtos status 200': (r) => r.status === 200 });

    let productIds = [];
    try {
      const body = JSON.parse(res.body);
      if (body && body.content && body.content.length > 0) {
        productIds = body.content.map(p => p.id);
      }
    } catch (e) {
      // Ignora erro se não conseguir decodificar
    }

    // Busca detalhe de um produto caso exista
    if (productIds.length > 0) {
      const randomId = productIds[Math.floor(Math.random() * productIds.length)];
      const detailRes = http.get(`${BASE}/api/produtos/${randomId}`);
      check(detailRes, { 'produto individual status 200': (r) => r.status === 200 });
    }
  });

  // 3. Autenticação (Login)
  group('auth', () => {
    const payload = JSON.stringify({
      email: 'admin',
      senha: 'admin123',
    });
    const params = {
      headers: { 'Content-Type': 'application/json' },
    };
    const loginRes = http.post(`${BASE}/api/auth/login`, payload, params);
    check(loginRes, { 'login status 200': (r) => r.status === 200 });
  });

  // 4. Auditoria
  group('auditoria', () => {
    const auditRes = http.get(`${BASE}/api/auditoria`);
    check(auditRes, { 'auditoria status 200': (r) => r.status === 200 });
  });

  sleep(1);
}

