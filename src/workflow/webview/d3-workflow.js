import { format } from "./utils";
import * as d3_base from "d3";
import * as d3_dag from "d3-dag";
const d3 = Object.assign({}, d3_base, d3_dag);

export function workflowChartHandler(data) {
  const svgSelection = d3.select("svg");
  svgSelection.selectAll("*").remove();
  let exampleData = format(data.Tasks);
  // setup
  let width = window.innerWidth - 100;
  let height = window.innerHeight - 100;
  let render = d3.dagStratify();
  let dag = render(exampleData);
  let layout = d3
    .sugiyama()
    .size([width, height])
    .layering(d3.layeringLongestPath())
    .decross(d3.decrossTwoLayer())
    .coord(d3.coordCenter());

  // implement
  const defs = svgSelection.append("defs");
  layout(dag);
  const steps = dag.size();
  const interp = d3.interpolateRainbow;
  const colorMap = {};
  dag.each((node, i) => {
    colorMap[node.id] = interp(i / steps);
  });

  const line = d3
    .line()
    .curve(d3.curveCatmullRom)
    .x(d => d.x)
    .y(d => d.y);

  svgSelection
    .append("g")
    .selectAll("path")
    .data(dag.links())
    .enter()
    .append("path")
    .attr("d", ({ data }) => line(data.points))
    .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke", ({ source, target }) => {
      const gradId = `${source.id}-${target.id}`;
      const grad = defs
        .append("linearGradient")
        .attr("id", gradId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", source.x)
        .attr("x2", target.x)
        .attr("y1", source.y)
        .attr("y2", target.y);
      grad
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorMap[source.id]);
      grad
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorMap[target.id]);
      return `url(#${gradId})`;
    });

  const nodes = svgSelection
    .append("g")
    .selectAll("g")
    .data(dag.descendants())
    .enter()
    .append("g")
    .attr("transform", ({ x, y }) => `translate(${x}, ${y})`)
    .on("mouseover", function() {
      d3.select(this)
        .select("circle")
        .transition()
        .duration(200)
        .attr("r", 25);
    })
    .on("mouseout", function() {
      d3.select(this)
        .select("circle")
        .transition()
        .duration(200)
        .attr("r", 20);
    });
  nodes
    .append("circle")
    .attr("r", 20)
    .attr("fill", n => colorMap[n.id]);
  nodes
    .append("text")
    .text(d => d.id)
    .attr("font-weight", "bold")
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white");
}
