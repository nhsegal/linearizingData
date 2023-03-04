import './main.css';
import makeChart from './makeChart';
import { makeHeader, makeLeftside } from './buildHTML';
import pickExperiment from './pickExperiment';
import makeData from './makeData';
import { sliderFunction, radioButtonCallback } from './callbackFunctions';
import { produceXLabel } from './helperFunctions';

const N = 12; // Number of data points
const currentExperiment = pickExperiment(); // Object with exponent, labels, etc
const coefficient = Math.round(100 * currentExperiment.coefficientRange
  - (50 * currentExperiment.coefficientRange) * Math.random()) / 100;
const noise = 0.7;
const currentDataObject = makeData(
  N,
  noise,
  coefficient,
  currentExperiment.exponent,
  currentExperiment.indepVarRange,
);

const myChart = makeChart(currentExperiment, currentDataObject, 1);
makeHeader();
makeLeftside(myChart);

const axisChoices = document.querySelectorAll('input[type=radio]');
axisChoices.forEach((choice) => {
  choice.addEventListener('change', (e) => radioButtonCallback(e, currentDataObject, currentExperiment));
});

document.querySelector('label[for="raw_data_option"]').innerHTML = ` ${produceXLabel(currentExperiment.indepVar, 1)} <br>`;
document.querySelector('label[for="sqd_data_option"]').innerHTML = ` ${produceXLabel(currentExperiment.indepVar, 2)} <br>`;
document.querySelector('label[for="inv_data_option"]').innerHTML = ` ${produceXLabel(currentExperiment.indepVar, -1)} <br>`;
document.querySelector('label[for="invsqd_data_option"]').innerHTML = ` ${produceXLabel(currentExperiment.indepVar, -2)} <br>`;

// add eventlistener to slider

const slopeSlider = document.querySelector('#slope_slider');
slopeSlider.addEventListener('input', () => { sliderFunction(currentExperiment); });
