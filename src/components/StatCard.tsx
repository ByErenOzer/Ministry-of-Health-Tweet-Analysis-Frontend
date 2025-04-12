import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  status?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  status = "neutral",
  icon,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <Card className="h-full overflow-hidden relative border-2 dark:border-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 group">
        {/* Gradient background accent */}
        <div 
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 -z-10",
            status === "positive" ? "bg-gradient-to-br from-emerald-400 to-teal-600" :
            status === "negative" ? "bg-gradient-to-br from-red-400 to-pink-600" :
            "bg-gradient-to-br from-blue-400 to-indigo-600"
          )}
        />
        
        {/* Top border accent */}
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 h-1 w-full",
            status === "positive" ? "bg-gradient-to-r from-emerald-400 to-teal-500" :
            status === "negative" ? "bg-gradient-to-r from-red-400 to-pink-500" :
            "bg-gradient-to-r from-blue-400 to-indigo-500"
          )}
        />
        
        <div className="p-5 md:p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <div className={cn(
              "p-2 rounded-full",
              status === "positive" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" :
              status === "negative" ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20" :
              "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
            )}>
              {icon}
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-baseline">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {value}
              </h2>
            </div>
            
            {change && (
              <div className="flex items-center mt-2">
                <div className={cn(
                  "flex items-center text-sm font-bold",
                  status === "positive" ? "text-emerald-600 dark:text-emerald-400" :
                  status === "negative" ? "text-red-600 dark:text-red-400" :
                  "text-blue-600 dark:text-blue-400"
                )}>
                  {status === "positive" ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {change}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">son 30 gün</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
