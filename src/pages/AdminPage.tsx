import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon, RefreshCw, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { api } from "@/lib/api";

interface ScrapingStatus {
  is_running: boolean;
  start_time: string | null;
  end_time: string | null;
  progress: number;
  message: string;
}

interface AnalysisResults {
  total_tweets?: number;
  unique_users?: number;
  date_range?: string[];
  most_liked?: any;
  most_retweeted?: any;
}

const AdminPage = () => {
  // Tarih seçimi için state
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 gün önce
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  // API durum bilgileri için state
  const [status, setStatus] = useState<ScrapingStatus>({
    is_running: false,
    start_time: null,
    end_time: null,
    progress: 0,
    message: "Hazır"
  });
  
  // Analiz sonuçları için state
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults>({});
  
  // Hata mesajları için state
  const [error, setError] = useState<string | null>(null);
  
  // Sayfa yüklendiğinde ve düzenli aralıklarla durum kontrolü yap
  useEffect(() => {
    // İlk durum kontrolü
    fetchStatus();
    
    // Düzenli durum kontrolü (her 5 saniyede bir)
    const intervalId = setInterval(fetchStatus, 5000);
    
    // Analiz sonuçlarını al
    fetchAnalysisResults();
    
    // Temizleme fonksiyonu
    return () => clearInterval(intervalId);
  }, []);
  
  // Durum bilgilerini çek
  const fetchStatus = async () => {
    try {
      const statusData = await api.getScrapingStatus();
      setStatus(statusData);
      
      // Çekme işlemi tamamlandıysa, sonuçları güncelle
      if (statusData.is_running === false && statusData.progress === 100) {
        fetchAnalysisResults();
      }
    } catch (err) {
      console.error("Durum çekme hatası:", err);
      setError("API bağlantısı kurulamadı. Backend çalışıyor mu?");
    }
  };
  
  // Analiz sonuçlarını çek
  const fetchAnalysisResults = async () => {
    try {
      const results = await api.getAnalysisResults();
      setAnalysisResults(results);
    } catch (err) {
      console.error("Analiz sonuçları çekme hatası:", err);
    }
  };
  
  // Tweet çekme işlemini başlat
  const startScraping = async () => {
    if (!startDate || !endDate) {
      setError("Lütfen başlangıç ve bitiş tarihlerini seçin");
      return;
    }
    
    try {
      setError(null);
      await api.startScraping(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      fetchStatus(); // Durumu hemen güncelle
    } catch (err: any) {
      console.error("Tweet çekme başlatma hatası:", err);
      setError(err.message || "Tweet çekme işlemi başlatılamadı");
    }
  };
  
  // API sağlık kontrolü
  const checkApiHealth = async () => {
    try {
      await api.checkHealth();
      setError(null);
    } catch (err) {
      setError("API bağlantısı kurulamadı. Backend çalışıyor mu?");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 from-health-50 via-white to-health-50/50 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Yönetim Paneli
        </h1>
        
        {/* Hata mesajı (varsa) */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2" 
                onClick={checkApiHealth}
              >
                Bağlantıyı Test Et
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Tweet Çekme Formu */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Tweet Çekme İşlemi</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "dd MMMM yyyy", { locale: tr })
                      ) : (
                        <span>Tarih Seç</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">Bitiş Tarihi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "dd MMMM yyyy", { locale: tr })
                      ) : (
                        <span>Tarih Seç</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={startScraping}
              disabled={status.is_running || !startDate || !endDate}
            >
              {status.is_running ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  İşlem devam ediyor...
                </>
              ) : (
                "Tweet Çekmeyi Başlat"
              )}
            </Button>
          </div>
          
          {/* İşlem Durumu */}
          {(status.is_running || status.progress > 0) && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">İşlem Durumu</p>
                <Badge 
                  variant={status.is_running ? "outline" : status.progress === 100 ? "default" : "secondary"}
                  className="flex items-center"
                >
                  {status.is_running ? (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Devam Ediyor
                    </>
                  ) : status.progress === 100 ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Tamamlandı
                    </>
                  ) : (
                    "Hazırlanıyor"
                  )}
                </Badge>
              </div>
              <Progress value={status.progress} className="h-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{status.message}</p>
              
              {status.start_time && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Başlangıç: {new Date(status.start_time).toLocaleString("tr-TR")}
                  {status.end_time && ` - Bitiş: ${new Date(status.end_time).toLocaleString("tr-TR")}`}
                </p>
              )}
            </div>
          )}
        </Card>
        
        {/* Analiz Sonuçları */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Son Analiz Sonuçları</h2>
          
          {Object.keys(analysisResults).length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    Toplam Tweet
                  </p>
                  <p className="text-2xl font-bold mt-1">{analysisResults.total_tweets || 0}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    Benzersiz Kullanıcılar
                  </p>
                  <p className="text-2xl font-bold mt-1">{analysisResults.unique_users || 0}</p>
                </div>
              </div>
              
              {/* En çok beğenilen tweet */}
              {analysisResults.most_liked && Object.keys(analysisResults.most_liked).length > 0 && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-sm font-medium mb-2">En Çok Beğenilen Tweet</p>
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <p className="text-sm">{analysisResults.most_liked.text}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">{analysisResults.most_liked.username}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(analysisResults.most_liked.date).toLocaleDateString()}</span>
                        <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          ♥ {analysisResults.most_liked.likes}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* En çok retweetlenen tweet */}
              {analysisResults.most_retweeted && Object.keys(analysisResults.most_retweeted).length > 0 && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-sm font-medium mb-2">En Çok Retweetlenen Tweet</p>
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <p className="text-sm">{analysisResults.most_retweeted.text}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">{analysisResults.most_retweeted.username}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(analysisResults.most_retweeted.date).toLocaleDateString()}</span>
                        <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          ↺ {analysisResults.most_retweeted.retweets}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchAnalysisResults}
                  className="flex items-center"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Sonuçları Yenile
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Henüz analiz sonucu bulunmuyor.<br />
                Bir veri çekme işlemi başlatın ve sonuçları görüntüleyin.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminPage; 