import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function FraudNetworkGraph({ apiUrl }) {
  const ref = useRef(null);

  useEffect(() => {
    fetch(`${apiUrl}/dashboard/ai/fraud-network`)
      .then(r => r.json())
      .then(data => renderGraph(data));
  }, []);

  function renderGraph({ nodes, links }) {
    const svg = d3.select(ref.current)
      .attr("width", "100%")
      .attr("height", 500);

    svg.selectAll("*").remove();

    const color = {
      ALERT: "#dc2626",
      CHECK: "#2563eb",
      DOCUMENT: "#7c3aed",
      ROUTING: "#059669",
      ACCOUNT: "#d97706",
    };

    const severityColor = {
      HIGH: "#dc2626",
      MEDIUM: "#f59e0b",
      LOW: "#16a34a",
    };

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(500 / 2, 500 / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", 2)
      .attr("stroke", d => severityColor[d.severity]);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", d => color[d.type])
      .call(d3.drag()
        .on("start", dragStart)
        .on("drag", dragged)
        .on("end", dragEnd)
      );

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text(d => d.type)
      .attr("font-size", "10px")
      .attr("fill", "#374151");

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
        .attr("x", d => d.x + 12)
        .attr("y", d => d.y + 4);
    });

    function dragStart(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnd(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  return (
    <div className="bg-white border rounded shadow p-6">
      <h2 className="text-xl font-bold mb-4">Fraud Network Graph</h2>
      <svg ref={ref}></svg>
    </div>
  );
}
