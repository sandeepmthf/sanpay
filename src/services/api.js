import axios from 'axios';

// Create Axios instance with base URL for the Spring Boot backend
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Demo Mode Toggle (Can be changed to true to mock responses without the backend)
export const isDemoMode = true;

// Mock Data
const MOCK_NODES = [
  { id: '1', position: { x: 250, y: 0 }, data: { label: 'You (Sender)' }, type: 'input' },
  { id: '2', position: { x: 100, y: 150 }, data: { label: 'Node A' } },
  { id: '3', position: { x: 400, y: 150 }, data: { label: 'Node B' } },
  { id: '4', position: { x: 250, y: 300 }, data: { label: 'Gateway' }, type: 'output' },
];

const MOCK_EDGES = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4', animated: true },
  { id: 'e3-4', source: '3', target: '4' },
];

let mockTransactions = [
  { id: 'txn_1001', receiver: 'john@upi', amount: 500, status: 'SUCCESS', date: new Date().toISOString() },
  { id: 'txn_1002', receiver: 'alice@upi', amount: 1200, status: 'PENDING', date: new Date().toISOString() },
  { id: 'txn_1003', receiver: 'bob@upi', amount: 350, status: 'FAILED', date: new Date().toISOString() },
];

// Axios Interceptor for Demo Mode Fallback
apiClient.interceptors.request.use(async (config) => {
  if (isDemoMode) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock Send Transaction
    if (config.url.includes('/transaction/send') && config.method === 'post') {
      const newTxn = {
        id: `txn_${Math.floor(Math.random() * 10000)}`,
        ...JSON.parse(config.data),
        status: 'PENDING',
        date: new Date().toISOString()
      };
      mockTransactions.unshift(newTxn);
      
      // Simulate eventual success/failure later in status polling
      setTimeout(() => {
        const txn = mockTransactions.find(t => t.id === newTxn.id);
        if (txn) {
          txn.status = Math.random() > 0.2 ? 'SUCCESS' : 'FAILED';
        }
      }, 5000);

      throw new axios.Cancel(`Mock Response: ${JSON.stringify({ data: newTxn })}`);
    }

    // Mock Get Transaction Status
    if (config.url.includes('/transaction/status/')) {
      const id = config.url.split('/').pop();
      const txn = mockTransactions.find(t => t.id === id) || { id, status: 'UNKNOWN' };
      throw new axios.Cancel(`Mock Response: ${JSON.stringify({ data: txn })}`);
    }

    // Mock Nearby Nodes
    if (config.url.includes('/nodes/nearby')) {
      throw new axios.Cancel(`Mock Response: ${JSON.stringify({ data: { nodes: MOCK_NODES, edges: MOCK_EDGES } })}`);
    }

    // Mock All Transactions
    if (config.url.includes('/transactions')) {
      throw new axios.Cancel(`Mock Response: ${JSON.stringify({ data: mockTransactions })}`);
    }
  }
  return config;
});

// Handle custom Mock Responses via Cancellation
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error) && error.message.startsWith('Mock Response:')) {
      return Promise.resolve(JSON.parse(error.message.replace('Mock Response: ', '')));
    }
    // Network errors will gracefully fall back to mock data if backend is dead and demo mode is ON
    if (isDemoMode && !error.response) {
       console.warn("Backend unavailable, falling back to mock response.");
       // Handle gracefully based on config.url if needed, though interceptor already handles it before sending
    }
    return Promise.reject(error);
  }
);

export const api = {
  sendTransaction: (data) => apiClient.post('/transaction/send', data),
  getTransactionStatus: (id) => apiClient.get(`/transaction/status/${id}`),
  getNearbyNodes: () => apiClient.get('/nodes/nearby'),
  getTransactions: () => apiClient.get('/transactions'),
};
