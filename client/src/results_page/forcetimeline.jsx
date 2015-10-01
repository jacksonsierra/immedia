var React = require('react');

var data = {
  name: 'data',
  children: [
        {
      date: '2015-09-28',
      children: [
        {
          source: 'NYT',
          children: [      
          {
            title: 'Elon Musk',
          }, {
            title: 'Larry Page',
          }
          ]
        },
        {
          source: 'Twitter',
          children: [
          {
            title: 'Chuck Norris',
          }, {
            title: 'The Rock',
          }
          ],
        }
        ],
      },
        {
      date: '2015-09-27',
      children: [],
    },
        {
      date: '2015-09-26',
      children: [],
    },
        {
      date: '2015-09-25',
      children: [
        {
          source: 'NYT',
          children: [      
          {
            title: 'Donald Trump',
          }, {
            title: 'Sarah Palin',
          }, {
            title: 'Ted Nugent',
          }
          ]
        },
        {
          source: 'Twitter',
          children: [
          {
            title: 'Kardashian 1',
          }, {
            title: 'Kardashian 2',
          }
          ]
        }
          ]
    },
        {
      date: '2015-09-24',
      children: [],
    },
        {
      date: '2015-09-23',
      children: [],
    },
  ]
};

var dateToday = new Date().toJSON().slice(0,10);
var d = new Date();
d.setDate(d.getDate() - 6);
dateWeekAgo = d.toJSON().slice(0, 10);


var ForceTimeLine = React.createClass({

  render: function() {
    return (
      <div id="d3container"></div>
    )
  },

  componentDidMount: function() {
    var margin = {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40
    };
    var width = 1200,
        height = 800;

    var y = d3.time.scale()
      .domain([new Date(dateWeekAgo), new Date(dateToday)])
      .rangeRound([height - margin.top - margin.bottom, 0])

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(d3.time.days, 1)
      .tickFormat(d3.time.format('%a %d'))
      .tickSize(20)
      .tickPadding(5)

    var svg = d3.select('#d3container').append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(400, ' + margin.top + ')')

    svg.append('g')
      .attr('class', 'yAxis')
      .attr({
        'font-family': 'Arial, sans-serif',
        'font-size': '10px',
      })
      .attr({
        fill: 'none',
        stroke: '#000',
        'shape-rendering': 'crispEdges',
      })
      .call(yAxis);
    
    var link, root, node;

    var force = d3.layout.force()
      .on("tick", tick)
      .gravity(0)
      .linkDistance(30)
      .size([width, height - 160]);

      root = data;
      root.fixed = true;
      root.x = 0;
      root.y = height / 2;
      for (var i = 0; i < root.children.length; i++) {
        root.children[i].depth1 = true;
        root.children[i].y = y(new Date(d.date)) - 20;
        root.children[i].x = 0;
        root.children[i].fixed = true;
      }
      update();

    function update() {

      var nodes = flatten(root);

      var links = d3.layout.tree().links(nodes);

      force.nodes(nodes);
      force.links(links);
      force.start();

      link = svg.selectAll("line.link")
          .data(links, function(d) { return d.target.id; })

      link.enter().insert("svg:line", ".node")
          .attr("class", "link")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; })
          .style({
            fill: 'none',
            stroke: '#ccc',
            strokeWidth: '1.5px',
          })

      link.exit().remove();

      node = svg.selectAll("circle.node")
          .data(nodes, function(d) { return d.id; })
          .style('fill', 'blue')

      node.transition()
          .attr("r", function(d) {
            if (d._children) {
              return d._children.length * 5;
            }
            if (d.source) {
              return 10
            }
            if (d.title) {
              return 20;
            }
            return 10;
          })

      node.enter().append("svg:circle")
          .attr("class", "node")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) {
            if (d._children) {
              return d._children.length * 3;
            }
            if (d.source) {
              return 10
            }
            if (d.title) {
              return 20;
            }
            return 10;
          })
          .on("click", toggle)
          .call(force.drag);

      node.exit().remove();
    }

    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }

    function toggle(d) {
      console.log(d);
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update();
    }

    function flatten(root) {
      var nodes = [], i = 0;

      function recurse(node) {
        if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
        if (!node.id) node.id = ++i;
        nodes.push(node);
        return node.size;
      }

      root.size = recurse(root);
      return nodes;
      }
  },

});

module.exports = ForceTimeLine;