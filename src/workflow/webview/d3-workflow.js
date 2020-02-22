import { format } from "./utils";
import * as d3_base from "d3";
import * as d3_dag from "d3-dag";
const d3 = Object.assign({}, d3_base, d3_dag);

export class WorkflowChart {
  constructor(el) {
    this.el = el;
    this.width = el.clientWidth;
    this.height = el.clientHeight;
    this.body = d3
      .select(el)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", `-50 -50 ${this.width + 100} ${this.height + 100}`);
  }

  _removeALl() {
    this.body.selectAll("*").remove();
  }
  _initData(data) {
    // data source
    this.JSONData = format(data.Tasks);
    this.root = d3.dagStratify()(this.JSONData);
    console.log("TCL: WorkflowChart -> init -> this.root", this.root);
  }
  _getLayout() {
    // layout
    this.layout = d3
      .sugiyama()
      .size([this.width, this.height])
      .layering(d3.layeringLongestPath())
      .decross(d3.decrossTwoLayer())
      .coord(d3.coordCenter());
    this.layout(this.root);
  }
  _initColorMap() {
    // colorMap
    this.colorMap = {};
    const steps = this.root.size();
    const interp = d3.interpolateRainbow;
    this.root.each((node, i) => {
      this.colorMap[node.id] = interp(i / steps);
    });
  }
  _initLine() {
    // line
    this.line = d3
      .line()
      .curve(d3.curveCatmullRom)
      .x(d => d.x)
      .y(d => d.y);
  }
  drawPath() {
    // path
    this.selectionLinks = this.body
      .append("g")
      .selectAll("path")
      .data(this.root.links())
      .enter()
      .append("path")
      .transition()
      .duration(500)
      .attr("d", ({ data }) => this.line(data.points))
      .attr("fill", "none")
      .attr("stroke-width", 3)
      .attr("stroke", "#000");
    // path draw color
    this.selectionLinks.attr("stroke", ({ source, target }) => {
      const gradId = `${source.id}-${target.id}`;
      const grad = this.defs
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
        .attr("stop-color", this.colorMap[source.id]);
      grad
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", this.colorMap[target.id]);
      return `url(#${gradId})`;
    });
  }
  drawNode() {
    const that = this;
    // nodes
    this.selectionNodeGroups = this.body
      .append("g")
      .selectAll("g")
      .data(this.root.descendants())
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
      })
      .on("click", this.onClickNode.bind(null, that)());
    this.selectionNodeCircles = this.selectionNodeGroups
      .append("circle")
      .transition()
      .duration(100)
      .attr("r", 20)
      .attr("fill", n => this.colorMap[n.id]);
    this.selectionNodeTexts = this.selectionNodeGroups
      .append("text")
      .text(d => d.id)
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .transition()
      .duration(200)
      .attr("fill", "white");
  }

  init(data) {
    this._removeALl();

    this._initData(data);
    this._getLayout();

    this.defs = this.body.append("defs");

    this._initColorMap();
    this._initLine();

    this.drawPath();
    this.drawNode();

    // setTimeout(() => {
    //   this._removeALl();
    //   this._initData(data);
    //   this._getLayout();
    //   this.defs = this.body.append("defs");
    //   this.drawPath();
    //   this.drawNode();
    // }, 2000);
  }

  onClickNode(that) {
    return function(node, index, arr) {
      that.selectionNodeGroups.exit().remove();
      let nodes = that.selectionNodeGroups.data();
      nodes.splice(index, i);
      console.log("TCL: onClickNode -> nodes", that.selectionNodeGroups.data());
    };
  }
}
