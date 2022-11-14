const root = d3.select("body").append("div").attr("id", "root");
root.append("h1").attr("id", "title").text("United State GDP");

const padding = 80;
const width = 1000;
const height = 450;

function loadBarChart(container, data) {
  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  loadAxis(svg, data);
  loadBars(svg, data);
}

function loadAxis(svg, data) {
  const baseDate = new Date(data[0][0]);
  const topDate = new Date(data[data.length - 1][0]);
  const xScale = d3.scaleTime();
  xScale.domain([baseDate, topDate]);
  xScale.range([padding, width - padding]);

  const yAxisScale = d3.scaleLinear();
  yAxisScale.domain([0, d3.max(data, (d) => d[1])]);
  yAxisScale.range([height - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
}

function loadBars(svg, data) {
  const xBarScale = d3.scaleLinear();
  xBarScale.domain([0, data.length - 1]);
  xBarScale.range([padding, width - padding]);

  const yBarScale = d3.scaleLinear();
  yBarScale.domain([0, d3.max(data, (d) => d[1])]);
  yBarScale.range([height - padding, padding]);

  const tooltip = root
    .append("div")
    .attr("id", "tooltip")
    .attr("data-date", "")
    .style("visibility", "hidden")
    .style("width", "auto")
    .style("height", "1rem");

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xBarScale(i))
    .attr("width", (width - 2 * padding) / data.length)
    .attr("y", (d) => yBarScale(d[1]))
    .attr("height", (d) => height - padding - yBarScale(d[1]))
    .attr("fill", "blue")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (data) => {
      console.log(data.originalTarget);
      tooltip.transition().style("visibility", "visible");
      tooltip.text(data.originalTarget.__data__[0]);
      document
        .getElementById("tooltip")
        .setAttribute("data-date", data.originalTarget.__data__[0]);
    })
    .on("mouseout", (data) => {
      tooltip.transition().style("visibility", "hidden");
      tooltip.text("");
      document.getElementById("tooltip").setAttribute("data-date", "");
    });
}

const dataset = fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((data) => data.json())
  .then((res) => loadBarChart(root, res.data));

/*
  const yScale = d3.scaleLinear();
  yScale.domain([0, d3.max(data, (d) => d[1])]);
  yScale.range([height - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  console.log(data);

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("width", (width - 2 * padding) / data.length)
    .attr("y", (d) => yScale(d[1]))
    .attr("height", (d) => height - padding - yScale(d[1]))
    .attr("fill", "blue")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1]);

}*/
