# Sağlık Bakanlığı Tweet Analiz Platformu

<div align="center">
  <img src="public/saglik_logo.png" alt="Sağlık Bakanlığı Logo" width="200">
  <h2>Twitter Veri Analiz ve Görselleştirme Platformu</h2>
  <p>T.C. Sağlık Bakanlığı'nın sosyal medya etkinliğini analiz eden modern web uygulaması</p>
  
  [![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
  [![D3.js](https://img.shields.io/badge/D3.js-7.x-F9A03C.svg)](https://d3js.org/)
  [![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-latest-000000.svg)](https://ui.shadcn.com/)
</div>

## 📋 Proje Hakkında

Bu platform, T.C. Sağlık Bakanlığı'nın Twitter üzerindeki varlığını analiz etmek ve içgörüler sağlamak amacıyla geliştirilmiştir. Bakanlık tarafından yapılan paylaşımlara gelen yanıtları, duygu analizlerini, kategori dağılımlarını ve trend konuları interaktif görselleştirmelerle sunar.

### 🎥 Demo Video

[Sağlık Bakanlığı Tweet Analiz Platformu Demo](https://github.com/ByErenOzer/Saglik-Bakanligi-Frontend_Projeleri/raw/main/Sağlık%20Bakanlığı%20Tweet%20Analiz%20Platformu%20-%20Google%20Chrome%202025-04-12%2020-20-42.mp4)

### 🌟 Özellikler

- **Gerçek Zamanlı Twitter Veri Çekimi**: `tweet-harvest` kütüphanesi ile güncel Twitter verileri toplanır
- **Duygu Analizi**: Tweetlerdeki duygu durumları (pozitif, negatif, nötr) otomatik olarak analiz edilir
- **Kategori Sınıflandırma**: Tweetler içeriklerine göre kategorilere ayrılır
- **Trend Analizi**: Popüler hashtag'ler ve konular tespit edilir
- **Zaman Serisi Grafikleri**: Zamanla değişen metriklerin görselleştirilmesi
- **Nefret Söylemi Tespiti**: İstenmeyen içeriklerin belirlenmesi ve analizi
- **Modern, Duyarlı Arayüz**: Hem masaüstü hem de mobil cihazlarda ideal deneyim
- **Veri Filtreleme**: Tarih aralığı, kategori, duygu durumuna göre filtreleme
- **Admin Paneli**: Veri toplama süreçlerini yönetme ve izleme

## 🚀 Kullanılan Teknolojiler

### Frontend

- **React 18**: Kullanıcı arayüzü geliştirme
- **TypeScript**: Tip güvenliği ve geliştirme deneyimi
- **Tailwind CSS**: Duyarlı ve modern tasarım
- **D3.js**: Gelişmiş veri görselleştirme
- **Shadcn UI**: Erişilebilir ve özelleştirilebilir UI bileşenleri
- **Framer Motion**: Pürüzsüz animasyonlar
- **Lucide Icons**: Modern icon seti
- **React Router**: Sayfa yönlendirme
- **Vite**: Hızlı geliştirme ve derleme
- **Next.js 14**: Sunucu taraflı işleme ve optimizasyon

### Backend

- **Flask API**: Hızlı ve hafif API hizmeti
- **Pandas**: Veri işleme ve analiz
- **tweet-harvest**: Twitter veri çekimi
- **NLTK**: Doğal dil işleme ve duygu analizi
- **SQLite**: Hafif veritabanı çözümü

## 🔧 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18+ ve npm/yarn/bun
- Python 3.9+
- Git

### Frontend Kurulumu

```bash
# Projeyi klonlayın
git clone https://github.com/ByErenOzer/Saglik-Bakanligi-Frontend_Projeleri.git
cd Saglik-Bakanligi-Frontend_Projeleri/frontend

# Bağımlılıkları yükleyin
npm install
# veya 
yarn install
# veya
bun install

# Geliştirme sunucusunu başlatın
npm run dev
# veya
yarn dev
# veya
bun run dev
```

### Backend Kurulumu

```bash
# Backend dizinine gidin
cd ../backend

# Python sanal ortamını oluşturun
python -m venv venv

# Sanal ortamı etkinleştirin
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# API sunucusunu başlatın
python app.py
```

Uygulama varsayılan olarak şu adreslerde çalışacaktır:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📊 Uygulama Yapısı

```
frontend/
├── public/              # Statik dosyalar
├── src/
│   ├── components/      # Tekrar kullanılabilir UI bileşenleri
│   ├── pages/           # Sayfa bileşenleri
│   ├── lib/             # Yardımcı fonksiyonlar ve API bağlantıları
│   ├── app/             # Next.js app router
│   ├── styles/          # Küresel stiller
│   └── types/           # TypeScript tip tanımlamaları
└── ...

backend/
├── data/                # Çekilen veriler ve sonuçlar
├── api/                 # API endpoint'leri
├── db/                  # Veritabanı işlemleri
├── scripts/             # Yardımcı scriptler
└── ...
```

## 💡 Katkıda Bulunma

Projeye katkıda bulunmak için:

1. Projeyi forklayın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

## 📞 İletişim

Eren Özer - [@ByErenOzer](https://github.com/ByErenOzer)

Proje Bağlantısı: [https://github.com/ByErenOzer/Saglik-Bakanligi-Frontend_Projeleri](https://github.com/ByErenOzer/Saglik-Bakanligi-Frontend_Projeleri)
