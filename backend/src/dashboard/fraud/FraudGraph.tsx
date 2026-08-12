import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function FraudGraph({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const nodes = data.nodes.map(n => ({ ...n }));
    const edges = data.edges.map(e => ({ ...e }));

    const width = 900;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#0B0B0F")
      .style("border", "1px solid #222")
      .call(
        d3.zoom().on("zoom", (event) => {
          svgGroup.attr("transform", event.transform);
        })
      );

    const svgGroup = svg.append("g");

    const colorMap = {
      OWNER: "#4ade80",
      ACCOUNT: "#60a5fa",
      DEVICE: "#facc15",
      DOCUMENT: "#f472b6",
      CHECK: "#34d399",
      FRAUD_FLAG: "#ef4444",
      SAR: "#a855f7",
    };

    const radiusMap = {
      OWNER: 22,
      ACCOUNT: 16,
      DEVICE: 14,
      DOCUMENT: 14,
      CHECK: 14,
      FRAUD_FLAG: 12,
      SAR: 12,
    };

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svgGroup.selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", "#444")
      .attr("stroke-width", 1.5);

    const node = svgGroup.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", d => radiusMap[d.type] || 10)
      .attr("fill", d => colorMap[d.type] || "#888")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(
        d3.drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    const label = svgGroup.selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text(d => d.label)
      .attr("fill", "#ddd")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("dy", -radiusMap["OWNER"]);

    node.on("click", (event, d) => {
      alert(`Node: ${d.label}\nType: ${d.type}\nID: ${d.id}`);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y - radiusMap[d.type] - 4);
    });

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return (
    <div className="gx-card p-4">
      <h2 className="text-xl font-bold mb-4">Fraud Intelligence Graph</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
}
