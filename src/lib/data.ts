// data.ts - Mock veriler

// Duygu Analizi Verileri
export const mockSentimentData = [
  { name: "Olumlu", value: 56, color: "#10b981" },
  { name: "Olumsuz", value: 27, color: "#ef4444" },
  { name: "Nötr", value: 17, color: "#f59e0b" },
];

// Kategori Dağılımı Verileri
export const mockCategoryData = [
  { name: "Sağlık Hizmetleri", value: 42 },
  { name: "İlaç ve Aşı", value: 22 },
  { name: "Hastane Yönetimi", value: 18 },
  { name: "Sağlık Sigortası", value: 10 },
  { name: "Diğer", value: 8 },
];

// Zaman İçinde Değişim Verileri
export const mockTimelineData = [
  { date: "2023-01-15", positive: 150, negative: 70, neutral: 30 },
  { date: "2023-02-15", positive: 180, negative: 60, neutral: 40 },
  { date: "2023-03-15", positive: 130, negative: 90, neutral: 50 },
  { date: "2023-04-15", positive: 170, negative: 50, neutral: 60 },
  { date: "2023-05-15", positive: 210, negative: 40, neutral: 30 },
  { date: "2023-06-15", positive: 160, negative: 80, neutral: 40 },
  { date: "2023-07-15", positive: 190, negative: 60, neutral: 50 },
];

// Popüler Hashtag Verileri
export const mockTrendingHashtags = [
  { tag: "#sağlık", count: 423, popular: true },
  { tag: "#covid19", count: 312, popular: true },
  { tag: "#aşı", count: 287, popular: true },
  { tag: "#hastane", count: 156, popular: false },
  { tag: "#doktor", count: 134, popular: false },
  { tag: "#sağlıklıyaşam", count: 98, popular: false },
  { tag: "#eczane", count: 87, popular: false },
  { tag: "#randevu", count: 76, popular: false },
];

// Öne Çıkan Konu Verileri
import { TrendingUp, Syringe, Pill, Hospital, UserCheck, Stethoscope } from "lucide-react";
import React from "react";

export const mockHotTopics = [
  {
    topic: "Aşı Kampanyası",
    count: 142,
    sentiment: 0.68,
    color: "#6366f1",
    secondaryColor: "#8b5cf6",
    trend: "up",
    icon: React.createElement(Syringe, { className: "text-indigo-500" }),
  },
  {
    topic: "İlaç Erişimi",
    count: 98,
    sentiment: -0.32,
    color: "#f43f5e",
    secondaryColor: "#ec4899",
    trend: "down",
    icon: React.createElement(Pill, { className: "text-pink-500" }),
  },
  {
    topic: "Hastane Yoğunluğu",
    count: 87,
    sentiment: -0.15,
    color: "#f97316",
    secondaryColor: "#f59e0b",
    trend: "down",
    icon: React.createElement(Hospital, { className: "text-orange-500" }),
  },
  {
    topic: "Sağlık Personeli",
    count: 72,
    sentiment: 0.41,
    color: "#10b981",
    secondaryColor: "#14b8a6",
    trend: "up",
    icon: React.createElement(UserCheck, { className: "text-emerald-500" }),
  },
  {
    topic: "Randevu Sistemi",
    count: 64,
    sentiment: 0.25,
    color: "#0ea5e9",
    secondaryColor: "#06b6d4",
    trend: "up",
    icon: React.createElement(TrendingUp, { className: "text-sky-500" }),
  },
  {
    topic: "Doktor Ziyaretleri",
    count: 56,
    sentiment: 0.18,
    color: "#8b5cf6",
    secondaryColor: "#a855f7",
    trend: "up",
    icon: React.createElement(Stethoscope, { className: "text-violet-500" }),
  },
]; 