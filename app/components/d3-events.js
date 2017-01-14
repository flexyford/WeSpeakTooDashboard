import Ember from 'ember';
import layout from '../templates/components/d3-events';

import { select } from 'd3-selection';

import { csvParse } from 'd3-dsv';
import { formatPrefix } from 'd3-format';

import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';

import { max } from 'd3-array';

import { axisBottom, axisLeft,  } from 'd3-axis';

const { run, get } = Ember;

export default Ember.Component.extend({
  layout,

  tagName: 'svg',
  classNames: ['awesome-d3-widget'],

  width: 720,
  height: 500,

  attributeBindings: ['width', 'height'],

  data: "State,Under 5 Years,5 to 13 Years,14 to 17 Years,18 to 24 Years,25 to 44 Years,45 to 64 Years,65 Years and Over\n\
CA,2704659,4499890,2159981,3853788,10604510,8819342,4114496\n\
TX,2027307,3277946,1420518,2454721,7017731,5656528,2472223\n\
NY,1208495,2141490,1058031,1999120,5355235,5120254,2607672\n\
FL,1140516,1938695,925060,1607297,4782119,4746856,3187797\n\
IL,894368,1558919,725973,1311479,3596343,3239173,1575308\n\
PA,737462,1345341,679201,1203944,3157759,3414001,1910571",

  didReceiveAttrs() {
    // Schedule a call to our `drawCircles` method on Ember's "render" queue, which will
    // happen after the component has been placed in the DOM, and subsequently
    // each time data is changed.
    debugger;
    run.scheduleOnce('render', this, this.drawGraph);
  },

  x0: Ember.computed('width', function() {
    return scaleBand()
      .rangeRound([0, get(this, 'width')])
      .paddingInner(0.1);
  }),

  x1: Ember.computed('width', function() {
    return scaleBand().padding(0.05);
  }),

  y: Ember.computed('height', function() {
    return scaleLinear()
      .rangeRound([get(this, 'height'), 0]);
  }),

  z: Ember.computed(function() {
    return scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  }),

  drawGraph() {
    let svg = select('svg');
    let margin = {top: 20, right: 20, bottom: 30, left: 40};
    let width = get(this, 'width') - margin.left - margin.right;
    let height = get(this, 'height') - margin.top - margin.bottom;

    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let data = csvParse(get(this, 'data'), function(d, i, columns) {
      for (i = 1; i < columns.length; ++i) {

        d[columns[i]] = +d[columns[i]];
        console.log(`d[${columns[i]}] = `, d[columns[i]]);
      }
      return d;
    });

    let keys = data.columns.slice(1);

    let x0 = get(this, 'x0');
    let x1 = get(this, 'x1');
    let y = get(this, 'y');
    let z = get(this, 'z');

    x0.domain(data.map(function(d) { return d.State; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, max(data, function(d) { return max(keys, function(key) { return d[key]; }); })]).nice();

    g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(x0));

    g.append("g")
      .attr("class", "axis")
      .call(axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Population");

    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
  }
});
