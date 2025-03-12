<template>
  <div id="chart"></div>
</template>

<script setup>
  import { computed, onMounted, watch } from 'vue';

  const props = defineProps({
    data: {
      default: () => [],
      type: Array
    }
  });

  const chartData = computed(() => props.data);

  watch(chartData, () => {
    renderChart();
  });

  function colorPicked(grade) {
    switch (grade?.toUpperCase() || '') {
      case 'A':
        return '#97b951';
      case 'B':
        return '#fbbf65';
      case 'C':
        return '#f6a800';
      case 'D':
        return '#f3a488';
      case 'F':
        return '#e5494d';
      default:
        return 'transparent';
    }
  }

  function renderChart() {
    const data = props.data;

    const margin = { top: 20, right: 20, bottom: 40, left: 80 };
    const width = 840 - margin.left - margin.right;
    const height = 60 * props.data.length - margin.top - margin.bottom;
    document.getElementById('chart').innerHTML = '';

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear().domain([0, 100]).range([0, width]);

    const y = d3
      .scaleBand()
      .domain(data.map(d => d.label))
      .range([0, height])
      .padding(0.1);

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(10));

    svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(y).tickSize(0));

    const ticks = x.ticks(10); // Adjust the number of ticks if needed

    svg
      .selectAll('.dotted-line')
      .data(ticks)
      .enter()
      .append('line')
      .attr('class', 'dotted-line')
      .attr('x1', d => x(d))
      .attr('x2', d => x(d))
      .attr('y1', 0)
      .attr('y2', height)
      .style('stroke', '#aaa')
      .style('stroke-dasharray', '4,4')
      .style('stroke-width', 1);

    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'arrow')
      .attr('d', d => {
        const xStart = x(d.start + (d.width > 0 ? 0 : d.width) + 1.5);
        const xEnd = x(d.start + (d.width > 0 ? d.width : 0) - 1.5);
        const yPos = y(d.label) + y.bandwidth() / 2;

        const arrowHeadSize = 5;

        if (d.width > 0) {
          return `M${xStart},${yPos} L${xEnd},${yPos} L${
            xEnd - arrowHeadSize
          },${yPos - arrowHeadSize} M${xEnd},${yPos} L${xEnd - arrowHeadSize},${
            yPos + arrowHeadSize
          }`;
        } else if (d.width < 0) {
          return `M${xEnd},${yPos} L${xStart},${yPos} L${
            xStart + arrowHeadSize
          },${yPos - arrowHeadSize} M${xStart},${yPos} L${
            xStart + arrowHeadSize
          },${yPos + arrowHeadSize}`;
        }
      })
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '1');

    svg
      .selectAll('.left-hexagon')
      .data(data)
      .enter()
      .append('polygon')
      .attr('class', 'left-hexagon')
      .attr('points', d => {
        const size = 10;
        const cx = d.width < 0 ? x(d.start + d.width) : x(d.start);
        const cy = y(d.label) + y.bandwidth() / 2;

        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const xPos = cx + size * Math.cos(angle);
          const yPos = cy + size * Math.sin(angle);
          points.push([xPos, yPos]);
        }

        return points.join(' ');
      })
      .style('fill', 'none')
      .style('stroke', d => {
        if (d.width > 0) return 'grey';
        else return colorPicked(d.grade);
      })
      .style('stroke-width', 1)
      .style('fill', d => {
        if (d.width > 0) return 'white';
        else return colorPicked(d.grade);
      });

    svg
      .selectAll('.right-hexagon')
      .data(data)
      .enter()
      .append('polygon')
      .attr('class', 'right-hexagon')
      .attr('points', d => {
        const size = 10;
        const cx = d.width < 0 ? x(d.start) : x(d.start + d.width);
        const cy = y(d.label) + y.bandwidth() / 2;

        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const xPos = cx + size * Math.cos(angle);
          const yPos = cy + size * Math.sin(angle);
          points.push([xPos, yPos]);
        }

        return points.join(' ');
      })
      .style('fill', d => {
        if (d.width < 0) return 'white';
        else return colorPicked(d.grade);
      })
      .style('stroke', d => {
        if (d.width < 0) return 'grey';
        else return colorPicked(d.grade);
      })
      .style('stroke-width', 1);

    svg
      .selectAll('.left-hexagon-text')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'left-hexagon-text')
      .attr('x', d => {
        const cx = d.width < 0 ? x(d.start + d.width) : x(d.start);
        return cx;
      })
      .attr('y', d => y(d.label) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '12px')
      .text(d => {
        if (d.width > 0) return '';
        else return d.grade;
      });

    svg
      .selectAll('.right-hexagon-text')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'right-hexagon-text')
      .attr('x', d => (d.width < 0 ? x(d.start) : x(d.start + d.width)))
      .attr('y', d => y(d.label) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '12px')
      .text(d => {
        if (d.width > 0) return d.grade;
        else return '';
      });

    svg
      .selectAll('.right-hexagon-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'right-hexagon-label')
      .attr('x', d => {
        const size = 10;
        const cx = d.width < 0 ? x(d.start) : x(d.start + d.width);
        return cx + size + 5;
      })
      .attr('y', d => y(d.label) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'left')
      .style('fill', 'black')
      .style('font-size', '12px')
      .text(d => {
        if (d.width > 0) {
          return `${(d.start + d.width).toFixed(2)}`;
        }
      });

    svg
      .selectAll('.right-hexagon-extra-text')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'right-hexagon-extra-text')
      .attr('x', d => {
        const size = 10;
        const cx = d.width < 0 ? x(d.start) : x(d.start + d.width);

        return cx + size + 38;
      })
      .attr('y', d => y(d.label) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'left')
      .style('fill', 'green')
      .style('font-size', '12px')
      .text(d => {
        if (d.width > 0) {
          return `(+${d.width})`;
        }
      });

    svg
      .selectAll('.left-hexagon-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'left-hexagon-label')
      .attr('x', d => {
        const size = 10;
        const cx = d.width < 0 ? x(d.start + d.width) : x(d.start);
        return cx - size - 47;
      })
      .attr('y', d => y(d.label) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'right')
      .style('fill', 'black')
      .style('font-size', '12px')
      .text(d => {
        if (d.width < 0) {
          return `${d.start + d.width}`;
        }
      });

    svg
      .selectAll('.left-hexagon-extra-text')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'left-hexagon-extra-text')
      .attr('x', d => {
        const size = 10;
        const cx = d.width < 0 ? x(d.start + d.width) : x(d.start);
        return cx - size - 30;
      })
      .attr('y', d => y(d.label) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'right')
      .style('fill', 'red')
      .style('font-size', '12px')
      .text(d => {
        if (d.width < 0) {
          return `(${d.width})`;
        }
      });
  }

  onMounted(() => {});
</script>
