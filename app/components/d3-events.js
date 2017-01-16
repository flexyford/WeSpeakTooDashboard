import Ember from 'ember';

import { select } from 'd3-selection';

import { csvParse } from 'd3-dsv';
import { formatPrefix } from 'd3-format';

import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';

import { max } from 'd3-array';

import { axisBottom, axisLeft,  } from 'd3-axis';

const { run, get, String: { camelize } } = Ember;

export default Ember.Component.extend({
  tagName: 'svg',
  classNames: ['awesome-d3-widget'],


  width: 900,
  height: 300,

  attributeBindings: ['width', 'height'],

  data: Ember.computed('events',
                        'events.@each.maleSpeakers',
                        'events.@each.femaleSpeakers',
                        'events.@each.nonBinarySpeakers', function() {
    // Recompute on male/female/non-binary speakers so d3 can redraw
    let keys = get(this, 'keys');

    return get(this, 'events')
      .sortBy('time').map((event) => {
        return keys.reduce((obj, key) => {
          // Ex: obj['male'] = event.get( 'maleSpeakers' );
          obj[key] = event.get( this.eventKey(key) );
          return obj;
        }, { eventDate: event.get('dateFormatted') });
      });
  }),

  keys: ['male', 'female', 'non-binary'],


  eventKey(key) {
    return `${camelize(key)}Speakers`;
  },

  didReceiveAttrs() {
    // Schedule a call to our `drawGraph` method on Ember's "render" queue, which will
    // happen after the component has been placed in the DOM, and subsequently
    // each time data is changed.
    Ember.$( "svg > g" ).remove();
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

  drawGraph: function() {
    let data = get(this, 'data');
    let keys = get(this, 'keys');

    this.draw(data, keys);
  },

  draw(data, keys) {
    let svg = select('svg');
    let margin = {top: 20, right: 20, bottom: 30, left: 40};
    let width = get(this, 'width') - margin.left - margin.right;
    let height = get(this, 'height') - margin.top - margin.bottom;

    let g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x0 = get(this, 'x0');
    let x1 = get(this, 'x1');
    let y = get(this, 'y');
    let z = get(this, 'z');

    x0.domain(data.map(function(d) { return d.eventDate; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, max(data, function(d) { return max(keys, function(key) { return d[key]; }); })]).nice();

    let maxDomainValue = y.domain().slice(-1).pop();

    g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.eventDate) + ",0)"; })
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
      .call(axisLeft(y).ticks(maxDomainValue, "d"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Speakers");

    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys)
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
