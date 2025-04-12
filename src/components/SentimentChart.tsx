
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface SentimentData {
  name: string;
  value: number;
}

interface SentimentChartProps {
  data: SentimentData[];
}

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

export function SentimentChart({ data }: SentimentChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm border dark:border-gray-700 border-gray-200 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 dark:text-white bg-gradient-to-r from-health-500 to-health-600 bg-clip-text text-transparent">
          Sentiment Analysis
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
