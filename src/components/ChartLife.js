import React, { useState, useEffect } from 'react';

const chartMap = {};

if (typeof window !== 'undefined') {
  window.addEventListener('resize', function() {
    for (let k in chartMap) {
      chartMap[k].resize();
    }
  });
}

export default function(Target) {
  let chartId = null;

  return React.memo(function(props) {
    useEffect(function() {
      return function() {
        if (!chartMap[chartId]) return;
        chartMap[chartId].dispose();
        delete chartMap[chartId];
        console.log('chartMap：\n', chartMap);
      };
    }, []);

    return <Target registerChart={registerChart} />;

    function registerChart(chart) {
      chartId = chart.id;
      chartMap[chart.id] = chart;
    }
  });
}
