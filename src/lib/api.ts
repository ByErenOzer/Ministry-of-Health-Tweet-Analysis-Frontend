const API_BASE_URL = "http://localhost:5000/api";

// API isteklerini yapan temel fonksiyon
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    // Hata kontrolü
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API yanıtı başarısız: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API isteği sırasında hata (${endpoint}):`, error);
    throw error;
  }
}

// API işlemleri
export const api = {
  // Sağlık kontrolü
  async checkHealth() {
    return fetchAPI('/health');
  },
  
  // Tweet çekme işlemini başlat
  async startScraping(startDate: string, endDate: string) {
    return fetchAPI('/scrape', {
      method: 'POST',
      body: JSON.stringify({ start_date: startDate, end_date: endDate }),
    });
  },
  
  // Çekme işleminin durumunu al
  async getScrapingStatus() {
    return fetchAPI('/status');
  },
  
  // Analiz sonuçlarını al
  async getAnalysisResults() {
    return fetchAPI('/analysis');
  },
  
  // Duygu analizi verilerini al
  async getSentimentData() {
    return fetchAPI('/data/sentiment');
  },
  
  // Kategori verilerini al
  async getCategoryData() {
    return fetchAPI('/data/categories');
  },
  
  // Zaman çizelgesi verilerini al
  async getTimelineData() {
    return fetchAPI('/data/timeline');
  },
};

// Websocket bağlantısı için yardımcı fonksiyon (gerçek zamanlı durum güncellemeleri için)
export function createStatusSocket() {
  const wsUrl = `ws://localhost:5000/ws/status`;
  
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('WebSocket bağlantısı açıldı');
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket hatası:', error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket bağlantısı kapandı');
  };
  
  return ws;
}

export default api; 