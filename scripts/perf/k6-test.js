import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<300'], // 95% of requests should be below 300ms
  },
};

export default function () {
  const res = http.get('https://jobequal.ch'); // I will use a placeholder URL
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
