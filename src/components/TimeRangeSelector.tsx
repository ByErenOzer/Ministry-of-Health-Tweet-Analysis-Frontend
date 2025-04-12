import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type TimeRange = "daily" | "weekly" | "monthly" | "yearly" | "threeyears" | "fiveyears" | "tenyears" | "custom";

interface TimeRangeSelectorProps {
  onRangeChange: (range: TimeRange, date?: DateRange) => void;
}

export function TimeRangeSelector({ 
  onRangeChange
}: TimeRangeSelectorProps) {
  const [selected, setSelected] = useState<TimeRange>("daily");

  useEffect(() => {
    onRangeChange(selected);
  }, [selected, onRangeChange]);

  const handleClick = (range: TimeRange) => {
    setSelected(range);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-xl p-2 backdrop-blur-sm">
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {[
            { value: "daily", label: "Günlük", gradient: "from-blue-500 to-indigo-500" },
            { value: "weekly", label: "Haftalık", gradient: "from-indigo-500 to-violet-500" },
            { value: "monthly", label: "Aylık", gradient: "from-violet-500 to-purple-500" },
            { value: "yearly", label: "Yıllık", gradient: "from-purple-500 to-pink-500" },
            { value: "threeyears", label: "3 Yıllık", gradient: "from-pink-500 to-rose-500" },
            { value: "fiveyears", label: "5 Yıllık", gradient: "from-rose-500 to-red-500" },
            { value: "tenyears", label: "10 Yıllık", gradient: "from-red-500 to-orange-500" }
          ].map((range) => (
            <motion.div
              key={range.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Button
                variant={selected === range.value ? "default" : "outline"}
                size="sm"
                className={cn(
                  "w-full h-10 text-xs md:text-sm font-medium transition-all duration-300 overflow-hidden rounded-xl border-2",
                  selected === range.value 
                    ? `bg-gradient-to-r ${range.gradient} text-white shadow-lg border-transparent` 
                    : "hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600"
                )}
                onClick={() => handleClick(range.value as TimeRange)}
              >
                <div className="relative z-10 flex items-center justify-center gap-1.5">
                  <CalendarIcon className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">{range.label}</span>
                  <span className="md:hidden">{range.label.slice(0, 3)}</span>
                </div>
                {selected === range.value && (
                  <motion.div
                    layoutId="activeBackground"
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r opacity-50",
                      range.gradient
                    )}
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
