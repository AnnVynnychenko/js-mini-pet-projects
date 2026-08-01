import { filterByCondition } from './modules/filter-rules.js';
import { sortByCondition } from './modules/sort-rules.js';
import { excludeOrByKeys } from './modules/exclude-or-rules.js';
import { excludeAnd } from './modules/exclude-and-rules.js';

const filterForm = document.querySelector('.filter-form');
const jsonInput = document.querySelector('#json-input');
const jsonOutput = document.querySelector('#json-output');
const conditions = document.querySelector('#conditions');
const presetsSection = document.querySelector('.presets-section');
const resetBtn = document.querySelector('#reset-btn');

let isInputChanged = true;

function validateFields(data, conditions) {
  if (!data || !conditions) {
    alert('Please fill in both fields!');
    return false;
  }
  return true;
}

function parseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(
      'Invalid JSON syntax! Please check your brackets or quotes.'
    );
  }
}

function getRawDataText() {
  if (jsonOutput.value.trim() === '' || isInputChanged) {
    return jsonInput.value.trim();
  } else {
    return jsonOutput.value.trim();
  }
}

async function fetchPreset(presetKey) {
  const url = new URL(`./presets/${presetKey}.json`, import.meta.url);
  const response = await fetch(url);
  if (!response.ok) throw new Error('File not found');
  return await response.json();
}

function displayData(presetKey, preset) {
  if (presetKey === 'user-data') {
    const rawData = preset.data || preset;
    jsonInput.value = JSON.stringify(rawData, null, 2);
    isInputChanged = true;
  } else {
    const rawConditions = preset.condition || preset;
    conditions.value = JSON.stringify(rawConditions, null, 2);
  }
}

async function handleClickPresets(event) {
  if (!event.target.classList.contains('preset-btn')) {
    return;
  }
  const presetKey = event.target.dataset.preset;

  try {
    const preset = await fetchPreset(presetKey);
    displayData(presetKey, preset);
  } catch (error) {
    console.error('Error loading preset:', error.message);
    alert(`Could not load preset file: ${presetKey}.json`);
  }
}

function handleSubmit(event) {
  event.preventDefault();

  let userData = [];
  let conditionsObj = {};

  const rawDataText = getRawDataText();
  const rawConditionsText = conditions.value.trim();

  if (!validateFields(rawDataText, rawConditionsText)) {
    return;
  }

  try {
    userData = parseJSON(rawDataText);
    conditionsObj = parseJSON(rawConditionsText);

    if (!Array.isArray(userData)) {
      throw new Error('Data must be an array');
    }

    let currentResult = [...userData];

    if (conditionsObj.include) {
      currentResult = filterByCondition(currentResult, conditionsObj.include);
    }

    if (conditionsObj.excludeOR) {
      currentResult = excludeOrByKeys(currentResult, conditionsObj.excludeOR);
    }

    if (conditionsObj.excludeAND) {
      currentResult = excludeAnd(currentResult, conditionsObj.excludeAND);
    }

    if (conditionsObj.sortBy) {
      currentResult = sortByCondition(currentResult, conditionsObj.sortBy);
    }

    jsonOutput.value = JSON.stringify(currentResult, null, 2);
    isInputChanged = false;
  } catch (validationError) {
    console.error('Error:', validationError.message);
    alert(validationError.message);
  }
}

function resetAll() {
  jsonInput.value = '';
  jsonOutput.value = '';
  conditions.value = '';
  isInputChanged = true;
}

presetsSection.addEventListener('click', handleClickPresets);
jsonInput.addEventListener('input', () => (isInputChanged = true));
filterForm.addEventListener('submit', handleSubmit);
resetBtn.addEventListener('click', resetAll);
