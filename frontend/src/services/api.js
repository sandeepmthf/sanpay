import axios from 'axios';

// Create Axios instance with base URL for the Spring Boot backend
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Pointing to Spring Boot's /api
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Demo Mode Toggle
export const isDemoMode = false;

let mockTransactions = []; // Used if demo mode is accidentally enabled

// Interceptor is simplified as we are using the real backend now.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error", error);
    return Promise.reject(error);
  }
);

export const api = {
  // Use /demo/send to inject a mesh packet as the "sender"
  sendTransaction: (data) => apiClient.post('/demo/send', {
    senderVpa: data.sender || 'alice@upi', // Fallback or mapping
    receiverVpa: data.receiver,
    amount: data.amount,
    pin: data.pin || '1234',
    ttl: 5,
    startDevice: 'phone-alice'
  }),
  // Polling for status is not natively an endpoint, but we can check if it settled by fetching transactions
  getTransactionStatus: async (id) => {
    try {
      const res = await apiClient.get('/transactions');
      const txn = res.data.find(t => t.id === id || t.packetId === id);
      if (txn) {
         return { data: { ...txn, status: 'SUCCESS' } };
      }
      return { data: { id, status: 'PENDING', amount: 0, receiver: 'Unknown' } };
    } catch {
      return { data: { id, status: 'PENDING', amount: 0, receiver: 'Unknown' } };
    }
  },
  // Mesh state maps to /mesh/state and we format it for React Flow
  getNearbyNodes: async () => {
    const res = await apiClient.get('/mesh/state');
    // Transform backend device list to React Flow nodes/edges
    const devices = res.data.devices || [];
    const nodes = devices.map((d, index) => ({
      id: d.deviceId,
      position: { x: (index % 3) * 200, y: Math.floor(index / 3) * 150 },
      data: { label: `${d.deviceId} (Pkts: ${d.packetCount})` },
      type: d.hasInternet ? 'output' : 'default'
    }));
    // Just mock some edges for topology visualization
    const edges = devices.slice(0, -1).map((d, i) => ({
      id: `e${d.deviceId}-${devices[i+1].deviceId}`,
      source: d.deviceId,
      target: devices[i+1].deviceId,
      animated: d.packetCount > 0
    }));
    return { data: { nodes, edges } };
  },
  getTransactions: () => apiClient.get('/transactions'),
  // Additional Mesh controls
  gossipMesh: () => apiClient.post('/mesh/gossip'),
  flushMesh: () => apiClient.post('/mesh/flush'),
};
