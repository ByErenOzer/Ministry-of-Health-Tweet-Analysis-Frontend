import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CategoryData {
  name: string;
  value: number;
  color?: string;
  gradientId?: string;
  solidColor?: string;
}

interface D3CategoryDistributionChartProps {
  data: CategoryData[];
  width?: number;
  height?: number;
  className?: string;
  type?: 'pie' | 'donut';
}

const DEFAULT_COLORS = [
  "url(#category-gradient-0)", // indigo
  "url(#category-gradient-1)", // violet
  "url(#category-gradient-2)", // pink
  "url(#category-gradient-3)", // emerald
  "url(#category-gradient-4)", // amber
  "url(#category-gradient-5)", // red
  "url(#category-gradient-6)", // blue
  "url(#category-gradient-7)", // teal
];

export function D3CategoryDistributionChart({ 
  data, 
  width = 600, 
  height = 400, 
  className = "",
  type = 'donut'
}: D3CategoryDistributionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !legendRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const legendContainer = d3.select(legendRef.current);
    
    // Clear previous chart
    svg.selectAll("*").remove();
    legendContainer.selectAll("*").remove();
    
    // Set dimensions
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create chart group
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);
    
    // Create gradient defs
    const defs = svg.append("defs");

    // Define beautiful gradients for each category
    const gradientColors = [
      { start: "#818cf8", end: "#4f46e5" }, // indigo
      { start: "#c4b5fd", end: "#8b5cf6" }, // violet
      { start: "#f9a8d4", end: "#ec4899" }, // pink
      { start: "#6ee7b7", end: "#10b981" }, // emerald
      { start: "#fcd34d", end: "#f59e0b" }, // amber
      { start: "#fca5a5", end: "#ef4444" }, // red
      { start: "#93c5fd", end: "#3b82f6" }, // blue
      { start: "#99f6e4", end: "#14b8a6" }  // teal
    ];

    // Create gradient definitions
    gradientColors.forEach((color, i) => {
      const gradient = defs.append("linearGradient")
        .attr("id", `category-gradient-${i}`)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color.start)
        .attr("stop-opacity", 1);
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color.end)
        .attr("stop-opacity", 1);
    });
    
    // Add radial gradient for center highlight
    const radialGradient = defs.append("radialGradient")
      .attr("id", "center-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%")
      .attr("fx", "50%")
      .attr("fy", "50%");
    
    radialGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0.2);
    
    radialGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0);
    
    // Assign colors to data
    const chartData = data.map((d, i) => ({
      ...d,
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      solidColor: gradientColors[i % gradientColors.length].end
    }));
    
    // Create pie generator
    const pie = d3.pie<CategoryData>()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.03);
    
    // Calculate pie data
    const pieData = pie(chartData);
    
    // Create arc generator
    const radius = Math.min(innerWidth, innerHeight) / 2;
    const outerRadius = radius * 0.85;
    const innerRadius = type === 'donut' ? outerRadius * 0.6 : 0;
    
    const arc = d3.arc<d3.PieArcDatum<CategoryData>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(6)
      .padAngle(0.02);
    
    // Create hover arc for animation
    const hoverArc = d3.arc<d3.PieArcDatum<CategoryData>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius * 1.08)
      .cornerRadius(6)
      .padAngle(0.02);
    
    // Add drop shadow filter
    const filter = defs.append("filter")
      .attr("id", "shadow")
      .attr("width", "200%")
      .attr("height", "200%");
    
    filter.append("feDropShadow")
      .attr("dx", "0")
      .attr("dy", "2")
      .attr("stdDeviation", "4")
      .attr("flood-opacity", "0.2");

    // Add glow filter for hover
    const glowFilter = defs.append("filter")
      .attr("id", "glow")
      .attr("width", "300%")
      .attr("height", "300%");
    
    glowFilter.append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", "6")
      .attr("result", "blur");
    
    glowFilter.append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("in2", "blur")
      .attr("operator", "over");
    
    // Add a subtle background circle
    g.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", outerRadius + 8)
      .attr("fill", "#f9fafb")
      .attr("opacity", 0.3);
    
    // Create pie slices with animation
    const slices = g.selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => d.data.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .attr("filter", "url(#shadow)")
      .style("cursor", "pointer")
      .style("opacity", 0)
      .on("mouseover", function(event, d) {
        // Highlight slice
        d3.select(this)
          .transition()
          .duration(300)
          .attr("d", hoverArc)
          .attr("filter", "url(#glow)");
        
        // Show tooltip
        const [x, y] = d3.pointer(event, document.body);
        const percentage = (d.data.value / d3.sum(chartData, d => d.value) * 100).toFixed(1);
        
        tooltip
          .style("opacity", 1)
          .style("left", `${x}px`)
          .style("top", `${y - 40}px`)
          .html(`
            <div class="font-bold text-lg" style="color: ${d.data.solidColor}">${d.data.name}</div>
            <div class="text-sm font-medium">${d.data.value} tweet (${percentage}%)</div>
          `);
      })
      .on("mouseout", function() {
        // Reset slice
        d3.select(this)
          .transition()
          .duration(300)
          .attr("d", arc)
          .attr("filter", "url(#shadow)");
        
        // Hide tooltip
        tooltip
          .style("opacity", 0);
      });
    
    // Add animation
    slices.transition()
      .duration(1000)
      .delay((d, i) => i * 150)
      .style("opacity", 1)
      .attrTween("d", function(d) {
        const interpolate = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });
    
    // Add center overlay for donut chart
    if (type === 'donut') {
      const totalValue = d3.sum(chartData, d => d.value);
      
      // Add center circle with subtle gradient
      g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", innerRadius)
        .attr("fill", "url(#center-gradient)")
        .attr("class", "center-circle");
      
      // Add center text with gradient
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.2em")
        .attr("class", "text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 fill-transparent")
        .style("font-size", "1.8rem")
        .text(totalValue);
      
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("class", "text-sm font-medium text-gray-500 dark:text-gray-400")
        .style("font-size", "0.8rem")
        .text("Toplam Tweet");

      // Add subtle pulse animation to center circle
      g.select(".center-circle")
        .attr("opacity", 0.8)
        .transition()
        .duration(2000)
        .attr("opacity", 1)
        .attr("r", innerRadius * 0.98)
        .transition()
        .duration(2000)
        .attr("opacity", 0.8)
        .attr("r", innerRadius)
        .on("end", function repeat() {
          d3.select(this)
            .transition()
            .duration(2000)
            .attr("opacity", 1)
            .attr("r", innerRadius * 0.98)
            .transition()
            .duration(2000)
            .attr("opacity", 0.8)
            .attr("r", innerRadius)
            .on("end", repeat);
        });
    }
    
    // Create modern legend
    const legend = legendContainer
      .selectAll(".legend-item")
      .data(chartData)
      .enter()
      .append("div")
      .attr("class", "legend-item flex items-center mb-3 cursor-pointer transform transition-transform hover:translate-x-1")
      .style("opacity", 0)
      .on("mouseover", function(event, d) {
        // Find corresponding slice and manually highlight it
        const matchingSlices = slices.filter((slice) => slice.data.name === d.name);
        if (!matchingSlices.empty()) {
          matchingSlices
            .transition()
            .duration(300)
            .attr("d", hoverArc)
            .attr("filter", "url(#glow)");
          
          // Show tooltip manually
          const rect = this.getBoundingClientRect();
          const percentage = (d.value / d3.sum(chartData, item => item.value) * 100).toFixed(1);
          
          tooltip
            .style("opacity", 1)
            .style("left", `${rect.right + 10}px`)
            .style("top", `${rect.top}px`)
            .html(`
              <div class="font-bold text-lg" style="color: ${d.solidColor}">${d.name}</div>
              <div class="text-sm font-medium">${d.value} tweet (${percentage}%)</div>
            `);
        }
        
        // Highlight legend item
        d3.select(this)
          .style("opacity", 1)
          .style("transform", "translateX(4px)");
      })
      .on("mouseout", function(event, d) {
        // Reset corresponding slice
        const matchingSlices = slices.filter((slice) => slice.data.name === d.name);
        if (!matchingSlices.empty()) {
          matchingSlices
            .transition()
            .duration(300)
            .attr("d", arc)
            .attr("filter", "url(#shadow)");
        }
        
        // Hide tooltip
        tooltip.style("opacity", 0);
        
        // Reset legend item
        d3.select(this)
          .style("opacity", 0.95)
          .style("transform", "translateX(0)");
      });
    
    // Add legend color box with gradient
    legend.append("div")
      .style("width", "16px")
      .style("height", "16px")
      .style("border-radius", "4px")
      .style("margin-right", "10px")
      .style("box-shadow", "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)")
      .style("background", (d, i) => `linear-gradient(135deg, ${gradientColors[i % gradientColors.length].start}, ${gradientColors[i % gradientColors.length].end})`);
    
    // Add legend text with percentage
    legend.append("div")
      .attr("class", "flex justify-between w-full items-center")
      .html(d => {
        const percentage = (d.value / d3.sum(chartData, d => d.value) * 100).toFixed(1);
        return `
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${d.name}</span>
          <span class="text-xs ml-2 font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">${percentage}%</span>
        `;
      });
    
    // Add title for legend
    legendContainer.insert("div", ":first-child")
      .attr("class", "text-sm font-bold mb-3 text-gray-600 dark:text-gray-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent")
      .text("Kategori Dağılımı");
    
    // Animate legend
    legend.transition()
      .duration(500)
      .delay((d, i) => 900 + i * 100)
      .style("opacity", 0.95);
    
  }, [data, width, height, type]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <svg ref={svgRef} className="w-full overflow-visible"></svg>
        </div>
        <div ref={legendRef} className="flex flex-col justify-center pl-4 md:w-1/3"></div>
      </div>
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg text-sm transition-opacity duration-300 opacity-0 z-50 border border-gray-200 dark:border-gray-700"
      ></div>
    </div>
  );
} 