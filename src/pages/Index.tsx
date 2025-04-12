import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { StatCard } from "@/components/StatCard";
import { SentimentChart } from "@/components/SentimentChart";
import { D3SentimentChart } from "@/components/D3SentimentChart";
import { D3CategoryDistributionChart } from "@/components/D3CategoryDistributionChart";
import { 
  MessageSquare, 
  ThumbsUp, 
  AlertTriangle, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Hash,
  RefreshCw,
  Filter,
  ListFilter,
  ChevronRight,
  Star,
  ArrowUpRight,
  Shield,
  XCircle,
  AlertOctagon,
  ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { 
  mockSentimentData, 
  mockCategoryData, 
  mockTimelineData, 
  mockTrendingHashtags, 
  mockHotTopics
} from "@/lib/data";
import * as d3 from 'd3';
import React from "react";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

type TimeRange = "daily" | "weekly" | "monthly" | "yearly" | "threeyears" | "fiveyears" | "tenyears" | "custom";

const TrendIcon = React.memo(() => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = 24;
      const height = 24;
      const margin = 2;

      // Sample data for mini trend line
      const data = [
        { x: 0, y: 2 },
        { x: 1, y: 5 },
        { x: 2, y: 3 },
        { x: 3, y: 8 },
        { x: 4, y: 6 },
        { x: 5, y: 9 }
      ];

      // Scales
      const xScale = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([margin, width - margin]);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y) || 0])
        .range([height - margin, margin]);

      // Create line generator
      const line = d3.line<typeof data[0]>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);

      // Clear previous content
      svg.selectAll("*").remove();

      // Add the line path
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 2)
        .attr("d", line);
    }
  }, []);

  return (
    <svg ref={svgRef} width="24" height="24" className="inline-block ml-2" />
  );
});

TrendIcon.displayName = 'TrendIcon';

const Index = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Memoize data processing functions
  const getSentimentData = useMemo(() => mockSentimentData, []);
  const getCategoryData = useMemo(() => mockCategoryData, []);
  const getTimelineData = useMemo(() => mockTimelineData, []);
  const getTrendingHashtags = useMemo(() => mockTrendingHashtags, []);
  const getHotTopics = useMemo(() => mockHotTopics, []);

  // Optimize API fetch with useCallback
  const fetchData = useCallback(() => {
    setLoading(true);
    // Performance optimization: Add debounce/throttle for API calls
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer); // Clean up timer on component unmount
  }, []);

  useEffect(() => {
    const cleanup = fetchData();
    
    // Clean up effect
    return cleanup;
  }, [timeRange, dateRange, fetchData]);

  // Optimize handler functions with useCallback
  const handleRangeChange = useCallback((range: TimeRange, dates?: DateRange) => {
    setTimeRange(range);
    if (dates) {
      setDateRange(dates);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 from-health-50 via-white to-health-50/50 p-4 md:p-8 transition-colors duration-300">
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <a href="/admin">
              <Users className="h-4 w-4 mr-1" />
              Yönetim
            </a>
          </Button>
      <ThemeToggle />
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <motion.img
              src="/saglik_logo.png"
              alt="Sağlık Bakanlığı Logo"
              className="h-28 md:h-32 w-auto mt-8"
              initial={{ scale: 0.8, opacity: 0, x: -20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            />
            <div className="text-center flex-1 mx-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap leading-relaxed py-4 animate-gradient bg-300">
                Sağlık Bakanlığı Tweet Analiz Platformu
          </h1>
            </div>
            <motion.img
              src="/saglik_logo.png"
              alt="Sağlık Bakanlığı Logo"
              className="h-28 md:h-32 w-auto mt-8"
              initial={{ scale: 0.8, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex justify-center w-full">
            <div className="inline-flex p-1.5 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              {[
                { label: "Günlük", value: "daily" },
                { label: "Haftalık", value: "weekly" },
                { label: "Aylık", value: "monthly" },
                { label: "Yıllık", value: "yearly" },
                { label: "3 Yıllık", value: "threeyears" },
                { label: "5 Yıllık", value: "fiveyears" },
                { label: "10 Yıllık", value: "tenyears" }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleRangeChange(range.value as TimeRange)}
                  className={`
                    relative group px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300
                    ${timeRange === range.value ? 
                      'text-white shadow-lg scale-105 z-10' : 
                      'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                    }
                  `}
                >
                  {timeRange === range.value && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2 font-semibold">
                    {range.label}
                  </span>
                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-xl bg-gray-100 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10 scale-95 group-hover:scale-100" />
                </button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6 bg-transparent p-1 gap-2">
              <TabsTrigger 
                value="overview" 
                className="text-sm md:text-base py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105 hover:shadow-md group"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Genel Bakış</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="sentiment" 
                className="text-sm md:text-base py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105 hover:shadow-md group"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
                    <ThumbsUp className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Duygu Analizi</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="hatespeech" 
                className="text-sm md:text-base py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105 hover:shadow-md group"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
                    <AlertOctagon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Nefret Söylemi</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="text-sm md:text-base py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105 hover:shadow-md group"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
                    <ListFilter className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Kategoriler</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="trends" 
                className="text-sm md:text-base py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105 hover:shadow-md group"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Trendler</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
                  title="Toplam Tweet"
            value="1,234"
                  change="+12%"
                  status="positive"
                  icon={<MessageSquare size={28} />}
            delay={0.1}
          />
          <StatCard
                  title="Olumlu Duygu"
            value="68%"
                  change="+5%"
                  status="positive"
                  icon={<ThumbsUp size={28} />}
            delay={0.2}
          />
          <StatCard
                  title="Nefret Söylemi"
            value="2%"
                  change="-0.5%"
                  status="positive"
                  icon={<AlertTriangle size={28} />}
            delay={0.3}
          />
          <StatCard
                  title="Etkileşim Oranı"
            value="12%"
                  change="+2.4%"
                  status="positive"
                  icon={<BarChart3 size={28} />}
            delay={0.4}
          />
        </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full"
          >
                  <Card className="h-full p-6 border dark:border-gray-700 border-gray-200 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Duygu Analizi
                      </h3>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrele
                      </Button>
                    </div>
                    <div className="h-[300px]">
                      <D3SentimentChart 
                        data={getSentimentData} 
                        height={300}
                      />
                    </div>
                  </Card>
          </motion.div>
                
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full"
          >
                  <Card className="h-full p-6 border dark:border-gray-700 border-gray-200 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Tweet Kategorileri
                      </h3>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ListFilter className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent align="end">
                          <div className="text-sm">
                            <p className="font-medium">Kategori Dağılımı</p>
                            <p className="text-muted-foreground">
                              Tweet içeriklerinin semantik analizine göre oluşturulmuştur.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div className="h-[300px]">
                      <D3CategoryDistributionChart
                        data={getCategoryData}
                        height={300}
                      />
                    </div>
                  </Card>
                </motion.div>
              </div>
              
              {/* Yeni Öne Çıkan Konular Tasarımı */}
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <Card className="p-6 border dark:border-gray-700 border-gray-200 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm relative dark:shadow-gray-900/30 bg-white/90 dark:bg-gray-800/90">
                  {/* Arka plan efekti */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-green-100/30 via-teal-100/30 to-cyan-100/30 dark:from-green-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-full blur-3xl"></div>
                  
                  <div className="relative">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-lg">
                          <Star className="h-5 w-5" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                          Öne Çıkan Konular
                        </h3>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        onClick={handleRefresh}
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <span className="flex items-center space-x-1">
                            <span>Yenile</span>
                            <RefreshCw className="h-3.5 w-3.5 ml-1" />
                          </span>
                        )}
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getHotTopics.map((topic, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                          className="relative rounded-xl overflow-hidden backdrop-blur-sm shadow-lg group"
                          style={{
                            background: `linear-gradient(135deg, ${topic.color}22 0%, ${topic.secondaryColor}22 100%)`,
                            borderWidth: "1px",
                            borderColor: `${topic.color}33`,
                          }}
                        >
                          <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${topic.color} 0%, ${topic.secondaryColor} 100%)` }}></div>
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center">
                                <div 
                                  className="text-xl mr-2 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md" 
                                  style={{ 
                                    boxShadow: `0 4px 12px ${topic.color}33` 
                                  }}
                                >
                                  {topic.icon}
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800 dark:text-gray-100">
                                    {topic.topic}
                                  </h4>
                                  <div className="flex items-center mt-1">
                                    <Badge 
                                      variant="outline" 
                                      className="text-xs font-medium" 
                                      style={{ 
                                        color: topic.color,
                                        borderColor: `${topic.color}44`
                                      }}
                                    >
                                      {topic.count} tweet
                                    </Badge>
                                    <div 
                                      className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium flex items-center"
                                      style={{ 
                                        backgroundColor: `${
                                          topic.sentiment > 0.2 ? '#10b98122' : 
                                          topic.sentiment < -0.2 ? '#ef444422' : '#f59e0b22'
                                        }`,
                                        color: `${
                                          topic.sentiment > 0.2 ? '#059669' : 
                                          topic.sentiment < -0.2 ? '#b91c1c' : '#b45309'
                                        }`
                                      }}
                                    >
                                      {topic.sentiment > 0.2 ? (
                                        <>
                                          <TrendingUp className="h-3 w-3 mr-1" />
                                          Olumlu
                                        </>
                                      ) : topic.sentiment < -0.2 ? (
                                        <>
                                          <TrendingDown className="h-3 w-3 mr-1" />
                                          Olumsuz
                                        </>
                                      ) : (
                                        'Nötr'
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <button 
                                className="rounded-full p-1.5 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                style={{ 
                                  color: topic.color
                                }}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="mt-3">
                              <div className="mb-1 flex justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">Etkileşim Oranı</span>
                                <span className="font-medium" style={{ color: topic.color }}>
                                  {Math.round((topic.count / getHotTopics[0].count) * 100)}%
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-500 ease-out"
                                  style={{ 
                                    width: `${(topic.count / getHotTopics[0].count) * 100}%`,
                                    background: `linear-gradient(90deg, ${topic.color} 0%, ${topic.secondaryColor} 100%)`
                                  }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              <div className="flex space-x-1">
                                {topic.trend === "up" && (
                                  <Badge className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <TrendingUp className="h-3 w-3 mr-1" /> Yükseliyor
                                  </Badge>
                                )}
                                {topic.trend === "down" && (
                                  <Badge className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                    <TrendingDown className="h-3 w-3 mr-1" /> Düşüyor
                                  </Badge>
                                )}
                              </div>
                              
                              <button 
                                className="text-xs flex items-center font-medium transition-colors duration-200"
                                style={{ color: topic.color }}
                              >
                                <span>Detaylar</span>
                                <ArrowUpRight className="h-3 w-3 ml-1" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                        <Hash className="h-4 w-4 mr-1 text-indigo-500" />
                        Popüler Hashtagler
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {getTrendingHashtags.map((tag, idx) => (
                          <Badge 
                            key={idx}
                            variant={tag.popular ? "default" : "outline"}
                            className={`px-3 py-1 text-sm ${
                              tag.popular 
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                                : "hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                            }`}
                          >
                            <span>{tag.tag}</span>
                            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-white/20 dark:bg-black/20">
                              {tag.count}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="sentiment" className="space-y-8">
              <Card className="p-8 shadow-xl">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
                  Detaylı Duygu Analizi
              </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* D3.js Duygu Analizi Grafiği */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-1.5 rounded-lg mr-3">
                        <BarChart3 size={20} />
                      </span>
                      Tweet Duygu Dağılımı
                    </h4>
                    <div className="h-96">
                      <D3SentimentChart 
                        data={getSentimentData} 
                        height={380}
                      />
                    </div>
                  </div>

                  {/* Zaman İçinde Duygu Değişimi Grafiği */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-1 rounded mr-2">
                        <TrendingUp size={16} />
                      </span>
                      Zaman İçinde Duygu Değişimi
                    </h4>
                    <div className="h-80 relative">
                      <svg 
                        className="w-full h-full" 
                        id="sentimentTimeline"
                        viewBox="0 0 600 320"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        {/* Arka Plan Çizgileri */}
                        {Array.from({ length: 6 }).map((_, i) => (
                          <line 
                            key={`grid-x-${i}`}
                            x1="40" 
                            y1={40 + i * 50} 
                            x2="580" 
                            y2={40 + i * 50}
                            stroke="#e5e7eb" 
                            strokeWidth="1" 
                            strokeDasharray="4 4"
                          />
                        ))}
                        
                        {getTimelineData.map((d, i) => (
                          <g key={`time-${i}`} transform={`translate(${70 + i * 75}, 0)`}>
                            {/* X ekseni tarihleri */}
                            <text 
                              x="0" 
                              y="300" 
                              textAnchor="middle" 
                              fontSize="12" 
                              fill="currentColor" 
                              className="text-gray-500 dark:text-gray-400"
                            >
                              {d.date.slice(5)}
                            </text>
                            
                            {/* Pozitif duygu çubuğu */}
                            <rect 
                              x="-20" 
                              y={290 - (d.positive / 210) * 250}
                              width="15" 
                              height={(d.positive / 210) * 250}
                              rx="2"
                              fill="url(#positiveGradient)"
                              className="opacity-90 hover:opacity-100 transition-opacity"
                            />
                            
                            {/* Negatif duygu çubuğu */}
                            <rect 
                              x="0" 
                              y={290 - (d.negative / 210) * 250}
                              width="15" 
                              height={(d.negative / 210) * 250}
                              rx="2"
                              fill="url(#negativeGradient)"
                              className="opacity-90 hover:opacity-100 transition-opacity"
                            />
                            
                            {/* Nötr duygu çubuğu */}
                            <rect 
                              x="20" 
                              y={290 - (d.neutral / 210) * 250}
                              width="15" 
                              height={(d.neutral / 210) * 250}
                              rx="2"
                              fill="url(#neutralGradient)"
                              className="opacity-90 hover:opacity-100 transition-opacity"
                            />
                          </g>
                        ))}
                        
                        {/* Gradient tanımları */}
                        <defs>
                          <linearGradient id="positiveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                          <linearGradient id="negativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f87171" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                          <linearGradient id="neutralGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fcd34d" />
                            <stop offset="100%" stopColor="#f59e0b" />
                          </linearGradient>
                        </defs>
                        
                        {/* Eksen çizgileri */}
                        <line x1="40" y1="40" x2="40" y2="290" stroke="#94a3b8" strokeWidth="1" />
                        <line x1="40" y1="290" x2="580" y2="290" stroke="#94a3b8" strokeWidth="1" />
                      </svg>
                      
                      {/* Grafik Açıklaması */}
                      <div className="absolute top-2 right-2 flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-sm mr-1 bg-emerald-500"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Olumlu</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-sm mr-1 bg-red-500"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Olumsuz</span>
                        </div>
                  <div className="flex items-center">
                          <div className="w-3 h-3 rounded-sm mr-1 bg-amber-500"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Nötr</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Duygu Analizi Özet Kartları */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-1 rounded mr-2">
                        <ThumbsUp size={16} />
                      </span>
                      Olumlu Tweet Özellikleri
                    </h4>
                    
                    <div className="space-y-3">
                      {['Sağlık Hizmetlerine Erişim', 'Sağlık Personeli Memnuniyeti', 'E-Randevu Sistemi', 'Aşı Kampanyası', 'Hastane Altyapısı'].map((item, i) => (
                        <div key={`positive-${i}`} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                          <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {Math.round(65 - i * 8)}%
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-1 rounded mr-2">
                        <AlertTriangle size={16} />
                      </span>
                      Olumsuz Tweet Özellikleri
                    </h4>
                    
                    <div className="space-y-3">
                      {['Bekleme Süreleri', 'İlaç Temini Sorunları', 'Randevu Zorlukları', 'Sigorta Sorunları', 'Personel Eksikliği'].map((item, i) => (
                        <div key={`negative-${i}`} className="flex items-center justify-between">
                  <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                          <div className="flex items-center text-xs font-medium text-red-600 dark:text-red-400">
                            {Math.round(45 - i * 6)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="hatespeech" className="space-y-8">
              <Card className="p-8 shadow-xl bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 border-0 overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent text-center">
                    Nefret Söylemi Analizi
                  </h3>
                  <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    Tweet içeriklerindeki zararlı içeriklerin tespiti ve kategorik dağılımı
                  </p>
                
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* İlk sütun - Ana metrikler ve interaktif donut grafik */}
                    <div className="col-span-1">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 h-full">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                          <span className="p-2 rounded-lg mr-2 bg-gradient-to-br from-red-500 to-rose-600 text-white">
                            <AlertOctagon size={18} />
                          </span>
                          Genel Bakış
                        </h4>
                        
                        {/* Ana metrikler */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                            <p className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1">Genel Oran</p>
                            <div className="flex items-end justify-between">
                              <span className="text-3xl font-bold text-red-600 dark:text-red-500">%2.1</span>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <TrendingDown className="h-3 w-3 mr-1" /> -0.4%
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                            <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">Tespit Oranı</p>
                            <div className="flex items-end justify-between">
                              <span className="text-3xl font-bold text-green-600 dark:text-green-500">%99.8</span>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <TrendingUp className="h-3 w-3 mr-1" /> +1.2%
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {/* İnteraktif Donut Grafik */}
                        <div className="relative h-64 mx-auto">
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-4xl font-bold text-red-600 dark:text-red-500">247</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Tespit Edilen</span>
                          </div>
                          <svg 
                            className="w-full h-full transform -rotate-90"
                            viewBox="0 0 100 100"
                          >
                            {/* Güvenli içerik (arka plan) */}
                            <circle 
                              cx="50" cy="50" r="40" 
                              fill="none" 
                              stroke="#e5e7eb" 
                              strokeWidth="12" 
                              className="dark:stroke-gray-700"
                            />
                            
                            {/* Zararlı içerik (ön plan) */}
                            <circle 
                              cx="50" cy="50" r="40" 
                              fill="none" 
                              stroke="url(#hateDonutGradient)" 
                              strokeWidth="12" 
                              strokeDasharray="251.2 251.2"
                              strokeDashoffset="246.2"  /* 251.2 - (251.2 * 0.02) */
                              strokeLinecap="round"
                              className="drop-shadow-xl transition-all duration-1000 ease-in-out hover:stroke-dashoffset-240"
                            />
                            
                            <defs>
                              <linearGradient id="hateDonutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#e11d48" />
                                <stop offset="100%" stopColor="#f97316" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        
                        {/* Etiketler */}
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-500 mr-2"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Zararlı</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Güvenli</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* İkinci sütun - Kategori dağılımı */}
                    <div className="col-span-1">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 h-full">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                          <span className="p-2 rounded-lg mr-2 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                            <XCircle size={18} />
                          </span>
                          Kategori Analizi
                        </h4>
                        
                        <div className="mt-4 space-y-5">
                          {[
                            { category: 'Hakaret İçeren', value: 35, color: '#ef4444' },
                            { category: 'Ayrımcılık', value: 25, color: '#f97316' },
                            { category: 'Tehdit İçeren', value: 18, color: '#f59e0b' },
                            { category: 'Yanlış Bilgi', value: 12, color: '#eab308' },
                            { category: 'Diğer', value: 10, color: '#84cc16' }
                          ].map((item, idx) => (
                            <div key={`hate-cat-${idx}`} className="group">
                              <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs font-semibold" style={{ color: item.color }}>
                                    {item.value}%
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    ({Math.round(247 * item.value / 100)})
                                  </span>
                                </div>
                              </div>
                              
                              <div className="relative h-2.5">
                                {/* Arka plan */}
                                <div className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-700"></div>
                                
                                {/* Ön plan */}
                                <div 
                                  className="absolute inset-y-0 left-0 rounded-full group-hover:opacity-100 opacity-90 transition-all duration-300 ease-out group-hover:shadow-md group-hover:scale-y-105 origin-left"
                                  style={{ 
                                    width: `${item.value}%`, 
                                    background: `linear-gradient(90deg, ${item.color}dd, ${item.color})`
                                  }}
                                >
                                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Üçüncü sütun - Zaman serisi grafiği */}
                    <div className="col-span-1">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 h-full">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                          <span className="p-2 rounded-lg mr-2 bg-gradient-to-br from-orange-500 to-yellow-600 text-white">
                            <TrendingDown size={18} />
                          </span>
                          Zamana Göre Değişim
                        </h4>
                        
                        <div className="relative h-[calc(100%-2rem)]">
                          <svg 
                            className="w-full h-full" 
                            viewBox="0 0 300 220"
                          >
                            {/* Izgara çizgileri */}
                            {[0, 1, 2, 3, 4].map((i) => (
                              <line 
                                key={`grid-line-${i}`}
                                x1="40" 
                                y1={40 + i * 40} 
                                x2="280" 
                                y2={40 + i * 40}
                                stroke="#e5e7eb" 
                                strokeWidth="1" 
                                strokeDasharray="5,5"
                                className="dark:stroke-gray-700"
                              />
                            ))}
                            
                            {/* Y ekseni değerleri */}
                            {[0, 1, 2, 3, 4].map((val) => (
                              <text 
                                key={`y-label-${val}`}
                                x="30" 
                                y={200 - val * 40} 
                                textAnchor="end" 
                                fontSize="10"
                                fill="currentColor" 
                                className="text-gray-500 dark:text-gray-400"
                                alignmentBaseline="middle"
                              >
                                %{val}
                              </text>
                            ))}
                            
                            {/* X ekseni değerleri */}
                            {['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'].map((month, i) => (
                              <text 
                                key={`x-label-${i}`}
                                x={40 + i * 20} 
                                y="210" 
                                textAnchor="middle" 
                                fontSize="8"
                                fill="currentColor" 
                                className="text-gray-500 dark:text-gray-400"
                              >
                                {month}
                              </text>
                            ))}
                            
                            {/* Trend çizgisi için veriler */}
                            {/* Veri noktaları */}
                            <g>
                              {[
                                { x: 40, y: 160 },
                                { x: 60, y: 170 },
                                { x: 80, y: 165 },
                                { x: 100, y: 150 },
                                { x: 120, y: 160 },
                                { x: 140, y: 145 },
                                { x: 160, y: 150 },
                                { x: 180, y: 135 },
                                { x: 200, y: 140 },
                                { x: 220, y: 130 },
                                { x: 240, y: 135 },
                                { x: 260, y: 125 }
                              ].map((point, i, arr) => (
                                <g key={`data-point-${i}`}>
                                  {/* Hat segmenti */}
                                  {i < arr.length - 1 && (
                                    <line 
                                      x1={point.x} 
                                      y1={point.y} 
                                      x2={arr[i+1].x} 
                                      y2={arr[i+1].y}
                                      stroke="url(#trendLineGradient)" 
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      className="drop-shadow-sm"
                                    />
                                  )}
                                  
                                  {/* Veri noktası */}
                                  <circle 
                                    cx={point.x} 
                                    cy={point.y} 
                                    r="3"
                                    className="fill-white stroke-2 stroke-red-500 dark:stroke-red-400 drop-shadow-md cursor-pointer hover:r-4 transition-all duration-300"
                                  />
                                </g>
                              ))}
                            </g>
                            
                            {/* Dolgulu alan */}
                            <path 
                              d="M 40 160 L 60 170 L 80 165 L 100 150 L 120 160 L 140 145 L 160 150 L 180 135 L 200 140 L 220 130 L 240 135 L 260 125 L 260 200 L 40 200 Z" 
                              fill="url(#areaGradient)"
                              opacity="0.15"
                            />
                            
                            {/* Eksen çizgileri */}
                            <line x1="40" y1="200" x2="280" y2="200" stroke="#94a3b8" strokeWidth="1" className="dark:stroke-gray-600" />
                            <line x1="40" y1="40" x2="40" y2="200" stroke="#94a3b8" strokeWidth="1" className="dark:stroke-gray-600" />
                            
                            {/* Gradyanlar */}
                            <defs>
                              <linearGradient id="trendLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#e11d48" />
                                <stop offset="100%" stopColor="#f97316" />
                              </linearGradient>
                              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Alt kısım - İstatistik kartları */}
                    <div className="col-span-1 lg:col-span-3 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-xl bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20 border border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md transition-shadow group">
                          <div className="flex items-center mb-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-sm group-hover:shadow-md transition-shadow mr-3">
                              <AlertOctagon size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-red-800/80 dark:text-red-300">Haftalık Tespit</p>
                              <h5 className="text-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">57</h5>
                            </div>
                          </div>
                          <div className="flex items-center text-xs mt-2">
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              <TrendingDown className="h-3 w-3 mr-1" /> -8.5% geçen haftaya göre
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="p-5 rounded-xl bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-100 dark:border-orange-900/30 shadow-sm hover:shadow-md transition-shadow group">
                          <div className="flex items-center mb-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm group-hover:shadow-md transition-shadow mr-3">
                              <AlertTriangle size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-orange-800/80 dark:text-orange-300">Ortalama Günlük</p>
                              <h5 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">8.2</h5>
                            </div>
                          </div>
                          <div className="flex items-center text-xs mt-2">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              <TrendingDown className="h-3 w-3 mr-1" /> -2.3% geçen aya göre
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-shadow group">
                          <div className="flex items-center mb-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm group-hover:shadow-md transition-shadow mr-3">
                              <Shield size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-blue-800/80 dark:text-blue-300">Müdahale Süresi</p>
                              <h5 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">17 dk</h5>
                            </div>
                          </div>
                          <div className="flex items-center text-xs mt-2">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              <TrendingDown className="h-3 w-3 mr-1" /> -3.1 dk iyileşme
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="p-5 rounded-xl bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-900/30 shadow-sm hover:shadow-md transition-shadow group">
                          <div className="flex items-center mb-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-sm group-hover:shadow-md transition-shadow mr-3">
                              <Shield size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-green-800/80 dark:text-green-300">Müdahale Oranı</p>
                              <h5 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">%99.2</h5>
                            </div>
                          </div>
                          <div className="flex items-center text-xs mt-2">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              <TrendingUp className="h-3 w-3 mr-1" /> +0.7% iyileşme
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-8">
              <Card className="p-8 shadow-xl">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
                  Kategori Analizi
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* D3.js Kategori Dağılımı Grafiği */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 col-span-1 lg:col-span-2">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-1.5 rounded-lg mr-3">
                        <ListFilter size={20} />
                      </span>
                      Tweet Kategori Dağılımı
                    </h4>
                    <div className="h-96">
                      <D3CategoryDistributionChart
                        data={getCategoryData}
                        height={380}
                      />
                    </div>
                  </div>
                  
                  {/* Kategori Detay Kartları */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1 rounded mr-2">
                        <Filter size={16} />
                      </span>
                      Kategori Büyüme Analizi
                    </h4>
                    
                    <div className="space-y-5">
                      {getCategoryData.map((category, i) => (
                        <div key={`growth-${i}`} className="relative">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                            <div className="flex items-center text-xs">
                              <span className={`font-medium ${
                                i % 2 === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {i % 2 === 0 ? '+' : '-'}{Math.round(10 + Math.random() * 20)}%
                              </span>
                              {i % 2 === 0 ? (
                                <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 ml-1 text-red-500" />
                              )}
                            </div>
                          </div>
                          
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${category.value}%`,
                                background: `linear-gradient(90deg, ${
                                  i % 4 === 0 ? '#6366f1' : 
                                  i % 4 === 1 ? '#8b5cf6' : 
                                  i % 4 === 2 ? '#ec4899' : '#10b981'
                                } 0%, ${
                                  i % 4 === 0 ? '#818cf8' : 
                                  i % 4 === 1 ? '#a78bfa' : 
                                  i % 4 === 2 ? '#f472b6' : '#34d399'
                                } 100%)`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <span className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-1 rounded mr-2">
                        <Users size={16} />
                      </span>
                      Kategori Dağılımı ve Duygu Analizi
                    </h4>
                    
                    <div className="space-y-4">
                      {getCategoryData.map((category, i) => (
                        <div key={`category-sentiment-${i}`} className="border border-gray-100 dark:border-gray-700 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-800 dark:text-gray-200">{category.name}</span>
                            <Badge variant="outline" className="text-xs font-medium">
                              {category.value}%
                            </Badge>
                          </div>
                          
                          <div className="flex items-center mt-2 space-x-2">
                            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${50 + i * 5}%` }}></div>
                            </div>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{50 + i * 5}%</span>
                            <ThumbsUp className="h-3 w-3 text-emerald-500" />
                          </div>
                          
                          <div className="flex items-center mt-1 space-x-2">
                            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-red-500" style={{ width: `${30 - i * 3}%` }}></div>
                            </div>
                            <span className="text-xs text-red-600 dark:text-red-400 font-medium">{30 - i * 3}%</span>
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-8">
              <Card className="p-8 shadow-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70">
                <div className="relative">
                  {/* Arka plan efekti */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-green-100/30 via-teal-100/30 to-cyan-100/30 dark:from-green-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-full blur-3xl"></div>
                  
                  <div className="relative">
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
                      Trend Analizi
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <button className="group relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300
                        bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl 
                        border-2 border-indigo-100 dark:border-indigo-900/30
                        hover:-translate-y-1 hover:scale-[1.02]">
                        {/* Highlight top border with gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-2xl"></div>
                        
                        <div className="flex flex-col items-center space-y-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md group-hover:shadow-indigo-500/20 group-hover:scale-110 transition-all duration-300">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">Trend Analizi</span>
                          <TrendIcon />
                        </div>
                      </button>

                      <button className="group relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300
                        bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl 
                        border-2 border-purple-100 dark:border-purple-900/30
                        hover:-translate-y-1 hover:scale-[1.02]">
                        {/* Highlight top border with gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-t-2xl"></div>
                        
                        <div className="flex flex-col items-center space-y-4">
                          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md group-hover:shadow-purple-500/20 group-hover:scale-110 transition-all duration-300">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                          <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Kullanıcı Analizi</span>
                        </div>
                      </button>

                      <button className="group relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300
                        bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl 
                        border-2 border-emerald-100 dark:border-emerald-900/30
                        hover:-translate-y-1 hover:scale-[1.02]">
                        {/* Highlight top border with gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-2xl"></div>
                        
                        <div className="flex flex-col items-center space-y-4">
                          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md group-hover:shadow-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                            <Hash className="h-6 w-6 text-white" />
                          </div>
                          <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">Hashtag Analizi</span>
                        </div>
                      </button>

                      <button className="group relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300
                        bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl 
                        border-2 border-blue-100 dark:border-blue-900/30
                        hover:-translate-y-1 hover:scale-[1.02]">
                        {/* Highlight top border with gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 rounded-t-2xl"></div>
                        
                        <div className="flex flex-col items-center space-y-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-md group-hover:shadow-blue-500/20 group-hover:scale-110 transition-all duration-300">
                            <BarChart3 className="h-6 w-6 text-white" />
                          </div>
                          <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">İstatistik Analizi</span>
                        </div>
                      </button>
                  </div>
                </div>
              </div>
            </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
