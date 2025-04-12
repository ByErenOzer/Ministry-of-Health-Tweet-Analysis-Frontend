# Sağlık Bakanlığı Twitter Analiz Platformu

Bu proje, T.C. Sağlık Bakanlığı'nın Twitter verilerini analiz eden ve görselleştiren modern bir web uygulamasıdır.

## Özellikler

- **Twitter Veri Çekme**: Belirtilen tarih aralığında Sağlık Bakanlığı'na ait tweetleri otomatik olarak çeker
- **Duygu Analizi**: Tweet içeriklerinin duygusal tonunu analiz eder (olumlu, olumsuz, nötr)
- **Kategori Analizi**: Tweet içeriklerini konulara göre sınıflandırır
- **Nefret Söylemi Tespiti**: Zararlı içerikleri tespit eder ve raporlar
- **Trend Analizi**: Zaman içindeki değişimleri ve trendleri görselleştirir
- **Modern Arayüz**: Kullanıcı dostu, kolay anlaşılır ve etkileşimli grafikler
- **Yönetim Paneli**: Veri toplama ve analiz süreçlerini yönetme imkanı

## Teknolojiler

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI, D3.js
- **Animasyonlar**: Framer Motion
- **Veri Görselleştirme**: D3.js, Chart.js

## Ekran Görüntüleri ve Demo

### Demo Video

Uygulamanın demo videosunu izlemek için aşağıdaki bağlantıya tıklayın:

[Demo Video](https://github.com/ByErenOzer/Saglik-Bakanligi-Twitter-Analizi-Frontend/raw/main/docs/demo-video.mp4)

*(Not: Video GitHub'a yüklendikten sonra doğru URL ile güncellenecektir)*

## Kurulum

```bash
# Depoyu klonlayın
git clone https://github.com/ByErenOzer/Saglik-Bakanligi-Twitter-Analizi-Frontend.git

# Proje dizinine gidin
cd Saglik-Bakanligi-Twitter-Analizi-Frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Kullanım

1. Uygulamayı başlattıktan sonra tarayıcınızda `http://localhost:5173` adresine gidin
2. Sol üstteki "Yönetim" butonuna tıklayarak admin paneline erişin
3. Tarih aralığı seçerek veri çekme işlemini başlatın
4. Ana sayfadaki sekmeleri kullanarak farklı analiz sonuçlarını görüntüleyin

## Katkıda Bulunma

Projeye katkıda bulunmak istiyorsanız:

1. Bu depoyu forklayın
2. Özellik dalı oluşturun (`git checkout -b yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Dalınızı ana depoya gönderin (`git push origin yeni-ozellik`)
5. Pull Request açın

## Lisans

Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.

## İletişim

Eren Özer - [GitHub](https://github.com/ByErenOzer)
