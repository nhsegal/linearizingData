import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { produceXLabel, produceXUnits } from './helperFunctions';

Chart.register(annotationPlugin);

const sliderFunction = (experiment) => {
  const myChart = Chart.getChart(document.getElementById('myChart'));
  const choiceVal = document.querySelector("input[type='radio']:checked").value;
  const val = document.getElementById('slope_slider').value;
  const yTop = myChart.scales.y.end;
  myChart.options.plugins.annotation.animations = false;
  myChart.options.plugins.annotation.annotations.line1.endValue = val;
  let slope = val / myChart.scales.x.end;
  if (myChart.scales.y.end / myChart.scales.x.end > 100) {
    slope = 10 * (slope / 10).toFixed(1);
  } else if (myChart.scales.y.end / myChart.scales.x.end > 10) {
    slope = (slope).toFixed(1);
  } else if (myChart.scales.y.end / myChart.scales.x.end > 1) {
    slope = (slope).toFixed(2);
  } else if (myChart.scales.y.end / myChart.scales.x.end > 0.1) {
    slope = (slope).toFixed(3);
  } else if (myChart.scales.y.end / myChart.scales.x.end > 0.01) {
    slope = (slope).toFixed(4);
  } else if (myChart.scales.y.end / myChart.scales.x.end > 0.001) {
    slope = (slope).toFixed(5);
  }
  myChart.options.scales.y.max = yTop;
  myChart.update();
  document.getElementById('trendline-equation-y-math').textContent = 'y = ';
  document.getElementById('trendline-equation-slope-math').textContent = slope;
  document.getElementById('trendline-equation-x-math').textContent = 'x';
  document.getElementById('trendline-equation-y-physics').textContent = `${experiment.depVarSymbol} = `;
  document.getElementById('trendline-equation-slope-physics').textContent = `(${slope}`;
  document.getElementById('trendline-equation-x-physics').innerHTML = `${produceXLabel(experiment.indepVarSymbol, choiceVal, true)}`;
  document.getElementById('fup1').textContent = `${produceXUnits(experiment.depVarUnits, 1, true)}`;
  document.getElementById('fdn1').textContent = `${produceXUnits(experiment.indepVarUnits, choiceVal, true)}`;
  document.getElementById('closing_paren').textContent = ')';
  document.getElementById('fup2').textContent = `${produceXUnits(experiment.depVarUnits, 1, true)}`;
  document.getElementById('fdn2').textContent = `${produceXUnits(experiment.indepVarUnits, choiceVal, true)}`;
};

const radioButtonCallback = (e, dataObject, experiment, prevExponent) => {
  const myChart = Chart.getChart(document.getElementById('myChart'));
  const xLabel = experiment.indepVar;
  const yLabel = experiment.depVar;
  const xSymbol = experiment.indepVarSymbol;
  const ySymbol = experiment.depVarSymbol;
  const xUnits = experiment.indepVarUnits;
  const choiceVal = e.target.value;

  // Change the plotted data, axis labels, title
  if (choiceVal === '1') {
    myChart.data.datasets[0].data = dataObject.rawData;
  } else if (choiceVal === '2') {
    myChart.data.datasets[0].data = dataObject.sqData;
  } else if (choiceVal === '-1') {
    myChart.data.datasets[0].data = dataObject.invData;
  } else if (choiceVal === '-2') {
    myChart.data.datasets[0].data = dataObject.invSqData;
  }
  myChart.options.scales.x.title.text = `${produceXLabel(xLabel, choiceVal)} `
  + `${produceXLabel(xSymbol, choiceVal)} (${produceXUnits(xUnits, choiceVal)})`;
  myChart.options.plugins.title.text = `${experiment.title} ${produceXLabel(yLabel, 1)} vs. ${produceXLabel(xLabel, choiceVal)}`;

  const depVar = document.getElementById('dep_var');
  depVar.textContent = `${ySymbol} = (`;
  const indepVar = document.getElementById('indep_var');
  indepVar.textContent = `) ${xSymbol}`;

  // Change the plotted trendline
  if (myChart.data.datasets[1]) {
    for (let i = 0; i < myChart.data.datasets[1].data.length; i += 1) {
      myChart.data.datasets[1].data[i].x **= (choiceVal / prevExponent);
    }
  }

  // Change the symbols in the trendline equations
  sliderFunction(experiment);

  myChart.update();
};

const plotFunction = (experiment) => {
  const myChart = Chart.getChart(document.getElementById('myChart'));
  const xMax = myChart.scales.x.end;
  const yMax = myChart.scales.y.end;
  const choiceVal = document.querySelector("input[type='radio']:checked").value;
  const coeff = document.getElementById('coefficient').value;
  const exp = parseInt(document.getElementById('exp').value, 10);
  const idealSet = [];
  document.getElementById('error').innerHTML = '';

  if (Number.isNaN(parseFloat(+exp)) || Number.isNaN(parseFloat(+coeff))) {
    document.getElementById('error').innerHTML = 'In the fields above please enter numeric values for both the coefficient and exponent.';
    return;
  }

  if (!(exp === -2 || exp === -1 || exp === 1 || exp === 2)) {
    document.getElementById('error').innerHTML = 'To fit the data, try picking the exponent from the set [-2, -1, 1, 2].';
    return;
  }

  if (choiceVal === -2) {
    // To extend the line
    for (let i = 1; i < 10; i += 1) {
      idealSet.push({
        x: xMax * 0.002 * i,
        y: coeff * (xMax * 0.002 * i) ** (exp / choiceVal),
      });
    }
  }
  for (let i = 1; i < 30; i += 1) {
    idealSet.push({
      x: (i * xMax) / 29,
      y: coeff * ((i * xMax) / 29) ** (exp / choiceVal),
    });
  }

  myChart.data.datasets[1] = {
    label: 'Ideal Data Set',
    type: 'scatter',
    data: idealSet,
    showLine: true,
    fill: false,
    borderColor: 'rgba(0, 99, 232, 1)',
    backgroundColor: 'rgba(0, 99, 232, 1)',
    borderWidth: 2,
    pointRadius: 0,
  };

  myChart.options.scales.y.max = yMax;
  myChart.update();

  const fup3 = document.querySelector('#fup3');
  const fdn3 = document.querySelector('#fdn3');
  const yvar = document.querySelector('#plotted-trendline-y');
  const xvar = document.querySelector('#plotted-trendline-x');
  const slope3 = document.querySelector('#plotted-trendline-slope');
  console.log(fup3);
  yvar.textContent = `${experiment.depVarSymbol} = (`;
  slope3.textContent = coeff;
  if (exp !== 1) {
    xvar.innerHTML = `) ${experiment.indepVarSymbol}<sup style= 'font-size: 0.75rem;'>${exp}</sup>`;
    fdn3.innerHTML = `${experiment.indepVarUnits}<sup style= 'font-size: 0.5rem;'>${exp}</sup>`;
  } else {
    xvar.innerHTML = `) ${experiment.indepVarSymbol}`;
    fdn3.innerHTML = `${experiment.indepVarUnits}`;
  }
  fup3.textContent = `${experiment.depVarUnits}`;
};

export { sliderFunction, radioButtonCallback, plotFunction };
