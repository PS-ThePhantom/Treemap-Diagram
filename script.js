document.addEventListener("DOMContentLoaded", () => {
  fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      displayTreeMap(data);
    })
    .catch((err) => {
      console.log("an error occured: ", err);
    });
});

const displayTreeMap = (data) => {
  const chart = {
    size: {
      width: 1000,
      height: 700
    },
    padding: {
      top: 100,
      left: 50,
      bottom: 50,
      right: 100
    }
  };

  const svg = d3
    .select("div")
    .append("svg")
    .attr("width", chart.size.width)
    .attr("height", chart.size.height)
    .style("box-shadow", "0 0 10px 5px grey")
    .style("border-radius", "10px");

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", chart.size.width / 2)
    .attr("y", chart.padding.top / 2 - 10)
    .attr("text-anchor", "middle")
    .text("Movie Sales")
    .style("font-size", "40px")
    .style("font-weight", "bold");

  svg
    .append("text")
    .attr("id", "description")
    .attr("x", chart.size.width / 2)
    .attr("y", chart.padding.top / 2 + 15)
    .attr("text-anchor", "middle")
    .text("Top Movies, Grouped By Genre")
    .style("font-size", "20px");

  const legendColors = d3.schemeCategory10;
  const movieCategory = {};
  const legendSize = 20;
  const legendSpacing = 20;

  for (let i = 0; i < data.children.length; i++)
    movieCategory[data.children[i].name] =
      legendColors[i % legendColors.length];

  const treemap = d3
    .treemap()
    .size([
      chart.size.width - chart.padding.left - chart.padding.right,
      chart.size.height - chart.padding.top - chart.padding.bottom
    ])
    .padding(0.5);

  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  treemap(root);

  const nodes = svg
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr(
      "transform",
      (d) =>
        `translate(${d.x0 + chart.padding.left},${d.y0 + chart.padding.top})`
    );

  const tooltipWidth = 200;
  const tooltip = d3
    .select("div")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(250, 250, 250, 85%)")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("width", tooltipWidth + "px")
    .style("text-align", "center")
    .style("box-shadow", "0 0 5px 2px grey");

  nodes
    .append("rect")
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => movieCategory[d.data.category])
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .on("mouseover", (event, d) => {
      tooltip
        .style("visibility", "visible")
        .html(
          `Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`
        )
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px")
        .attr("data-value", d.data.value);
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));

  nodes
    .append("text")
    .attr("x", 5)
    .attr("y", 20)
    .text((d) => d.data.name)
    .style("font-size", "12px")
    .style("fill", "white");

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .selectAll(".legend-item")
    .data(data.children)
    .enter()
    .append("g")
    .attr(
      "transform",
      (d, i) =>
        "translate(0," +
        (chart.size.height / 2 -
          (data.children.length / 2 - 1) * (legendSize + legendSpacing) +
          i * (legendSize + legendSpacing)) +
        ")"
    );

  legend
    .append("text")
    .attr("x", chart.size.width - chart.padding.right * 0.7)
    .attr("y", legendSize * 0.7)
    .style("font-size", "13px")
    .style("text-anchor", "start")
    .text((d) => d.name);

  legend
    .append("rect")
    .attr("x", chart.size.width - chart.padding.right + 5)
    .attr("width", legendSize)
    .attr("height", legendSize)
    .style("fill", (d) => movieCategory[d.name])
    .attr("class", "legend-item");
};