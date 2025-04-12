import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SentimentData {
  name: string;
  value: number;
  color?: string;
  gradientId?: string;
  fillColor?: string;
}

interface D3SentimentChartProps {
  data: SentimentData[];
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_COLORS = {
  "Olumlu": "url(#positiveGradient)", // emerald-500
  "Olumsuz": "url(#negativeGradient)", // red-500
  "Nötr": "url(#neutralGradient)", // amber-500
  "default": "url(#defaultGradient)" // indigo-500
};

export function D3SentimentChart({ 
  data, 
  width = 600, 
  height = 400, 
  className = ""
}: D3SentimentChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    
    // Clear previous chart
    svg.selectAll("*").remove();
    
    // Set dimensions
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create chart group
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Create gradient defs
    const defs = svg.append("defs");

    // Define global gradients
    const positiveGradient = defs.append("linearGradient")
      .attr("id", "positiveGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    
    positiveGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4ade80")
      .attr("stop-opacity", 1);
    
    positiveGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#10b981")
      .attr("stop-opacity", 1);

    const negativeGradient = defs.append("linearGradient")
      .attr("id", "negativeGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    
    negativeGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f87171")
      .attr("stop-opacity", 1);
    
    negativeGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ef4444")
      .attr("stop-opacity", 1);

    const neutralGradient = defs.append("linearGradient")
      .attr("id", "neutralGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    
    neutralGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#fcd34d")
      .attr("stop-opacity", 1);
    
    neutralGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#f59e0b")
      .attr("stop-opacity", 1);

    const defaultGradient = defs.append("linearGradient")
      .attr("id", "defaultGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    
    defaultGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#a5b4fc")
      .attr("stop-opacity", 1);
    
    defaultGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#6366f1")
      .attr("stop-opacity", 1);
    
    // Prepare data with colors
    const chartData = data.map(d => ({
      ...d,
      fillColor: DEFAULT_COLORS[d.name as keyof typeof DEFAULT_COLORS] || DEFAULT_COLORS.default
    }));
    
    // Create scales
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.4);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value) || 0])
      .range([innerHeight, 0])
      .nice();
    
    // Add drop shadow filter
    const filter = defs.append("filter")
      .attr("id", "shadow")
      .attr("width", "200%")
      .attr("height", "200%");
    
    filter.append("feDropShadow")
      .attr("dx", "0")
      .attr("dy", "3")
      .attr("stdDeviation", "4")
      .attr("flood-opacity", "0.2");

    // Add glow filter for hover effect
    const glowFilter = defs.append("filter")
      .attr("id", "glow")
      .attr("width", "200%")
      .attr("height", "200%");

    glowFilter.append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", "3")
      .attr("result", "blur");

    glowFilter.append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("in2", "blur")
      .attr("operator", "over");
    
    // Add background grid
    g.selectAll(".grid-line-y")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "grid-line-y")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "3,3");
    
    // Add X axis
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("class", "text-sm text-gray-600 dark:text-gray-400")
      .style("text-anchor", "middle")
      .style("font-weight", "medium");
    
    // Add Y axis
    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d}%`))
      .selectAll("text")
      .attr("class", "text-sm text-gray-600 dark:text-gray-400")
      .style("font-weight", "medium");
    
    // Style axes
    g.selectAll(".domain, .tick line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 0.5);
    
    // Create bar background
    g.selectAll(".bar-bg")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar-bg")
      .attr("x", d => xScale(d.name) as number)
      .attr("width", xScale.bandwidth())
      .attr("y", 0)
      .attr("height", innerHeight)
      .attr("rx", 6)
      .attr("fill", "#f9fafb")
      .attr("opacity", 0.3);
    
    // Create bars with animation
    const bars = g.selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.name) as number)
      .attr("width", xScale.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("rx", 8)
      .attr("fill", d => d.fillColor)
      .attr("filter", "url(#shadow)")
      .style("cursor", "pointer");
    
    // Add animation
    bars.transition()
      .duration(1200)
      .delay((_, i) => i * 200)
      .attr("y", d => yScale(d.value))
      .attr("height", d => innerHeight - yScale(d.value))
      .ease(d3.easeBounceOut);
    
    // Add value labels on top of bars
    g.selectAll(".value-label")
      .data(chartData)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", d => (xScale(d.name) as number) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.value) - 12)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("class", "text-gray-800 dark:text-gray-200 font-bold text-sm")
      .style("opacity", 0)
      .text(d => `${d.value}%`)
      .transition()
      .duration(800)
      .delay((_, i) => i * 200 + 600)
      .style("opacity", 1);
    
    // Add tooltip interactions
    bars.on("mouseover", function(event, d) {
      const [x, y] = d3.pointer(event);
      
      // Show tooltip
      tooltip
        .style("opacity", 1)
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY - 40}px`)
        .html(`
          <div class="font-bold text-lg" style="color: ${d.color}">${d.name}</div>
          <div class="text-sm font-medium">${d.value}% oranında</div>
        `);
      
      // Highlight bar
      d3.select(this)
        .transition()
        .duration(200)
        .attr("filter", "url(#glow)")
        .attr("transform", "scale(1.03, 1)")
        .attr("transform-origin", `${(xScale(d.name) as number) + xScale.bandwidth() / 2}px ${innerHeight}px`);
    })
    .on("mouseout", function() {
      // Hide tooltip
      tooltip
        .style("opacity", 0);
      
      // Reset bar
      d3.select(this)
        .transition()
        .duration(200)
        .attr("filter", "url(#shadow)")
        .attr("transform", "scale(1)");
    });
    
    // Add chart title
    svg.append("text")
      .attr("class", "chart-title bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Tweet Duygu Dağılımı");

    // Add data labels
    g.append("text")
      .attr("class", "total-label")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("class", "text-gray-600 dark:text-gray-400 font-medium text-xs")
      .text("Toplam Tweet Duygu Analizi Sonuçları");
    
  }, [data, width, height]);

  return (
    <div className={`relative ${className}`}>
      <svg ref={svgRef} className="w-full h-full overflow-visible"></svg>
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg text-sm transition-opacity duration-300 opacity-0 z-50 border border-gray-200 dark:border-gray-700"
      ></div>
    </div>
  );
} 