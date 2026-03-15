import { quickSort } from './quicksort.js';
import {
	addStudent,
	clearAll,
	getStudents,
	removeStudent
} from './storage.js';

const form = document.getElementById('student-form');
const nameInput = document.getElementById('name-input');
const scoreInput = document.getElementById('score-input');
const tableBody = document.getElementById('student-table-body');
const statsPanel = document.getElementById('stats-panel');
const quicksortStepsPanel = document.getElementById('quicksort-steps-panel');
const clearButton = document.getElementById('clear-btn');
const exportButton = document.getElementById('export-btn');
const formMessage = document.getElementById('form-message');

let students = [];
let lastSortedRows = [];
let quickSortStepsState = [];
let currentStepIndex = 0;
let quickSortAutoPlayTimer = null;

function stopQuickSortAutoPlay() {
	if (quickSortAutoPlayTimer) {
		window.clearInterval(quickSortAutoPlayTimer);
		quickSortAutoPlayTimer = null;
	}
}

function startQuickSortAutoPlay() {
	if (quickSortStepsState.length <= 1 || quickSortAutoPlayTimer) {
		return;
	}

	quickSortAutoPlayTimer = window.setInterval(() => {
		if (currentStepIndex >= quickSortStepsState.length - 1) {
			stopQuickSortAutoPlay();
			renderQuickSortSteps(quickSortStepsState, students.length);
			return;
		}

		currentStepIndex += 1;
		renderQuickSortSteps(quickSortStepsState, students.length);
	}, 900);
}

function getGrade(score) {
	if (score >= 75) {
		return { label: '1', className: 'grade-1' };
	}
	if (score >= 69) {
		return { label: '2.1', className: 'grade-2-1' };
	}
	if (score >= 60) {
		return { label: '2.2', className: 'grade-2-2' };
	}
	if (score >= 50) {
		return { label: 'P', className: 'grade-p' };
	}
	return { label: 'F', className: 'grade-f' };
}

function formatNumber(value) {
	return Number.isFinite(value) ? value.toFixed(2) : '0.00';
}

function validateInputs(name, scoreText) {
	const trimmedName = name.trim();
	const numericScore = Number(scoreText);

	if (!trimmedName) {
		return { valid: false, message: 'Student name is required.' };
	}
	if (!Number.isFinite(numericScore)) {
		return { valid: false, message: 'Score must be a valid number.' };
	}
	if (numericScore < 0 || numericScore > 100) {
		return { valid: false, message: 'Score must be between 0 and 100.' };
	}

	return { valid: true, name: trimmedName, score: numericScore };
}

function traceQuickSortSteps(sourceStudents) {
	const steps = [];
	if (sourceStudents.length <= 1) {
		return steps;
	}

	const traceList = sourceStudents.map((student) => ({
		id: student.id,
		name: student.name,
		score: Number(student.score)
	}));

	function partitionTrace(list, low, high) {
		const pivotValue = Number(list[high].score);
		let i = low - 1;

		for (let j = low; j < high; j += 1) {
			if (Number(list[j].score) >= pivotValue) {
				i += 1;
				if (i !== j) {
					[list[i], list[j]] = [list[j], list[i]];
				}
			}
		}

		const pivotIndex = i + 1;
		if (pivotIndex !== high) {
			[list[pivotIndex], list[high]] = [list[high], list[pivotIndex]];
		}

		const rangeSnapshot = list
			.slice(low, high + 1)
			.map((entry) => `${entry.name} (${entry.score})`)
			.join(', ');

		steps.push({
			low,
			high,
			pivotValue,
			pivotIndex,
			rangeSnapshot
		});

		return pivotIndex;
	}

	function sortTrace(list, low, high) {
		if (low < high) {
			const pivotIndex = partitionTrace(list, low, high);
			sortTrace(list, low, pivotIndex - 1);
			sortTrace(list, pivotIndex + 1, high);
		}
	}

	sortTrace(traceList, 0, traceList.length - 1);
	return steps;
}

function buildSortedRows(sourceStudents) {
	const stats = { comparisons: 0, swaps: 0 };
	const quickSortSteps = traceQuickSortSteps(sourceStudents);
	const sortedStudents = quickSort([...sourceStudents], 'score', stats);

	const rows = sortedStudents.map((student, index) => {
		const score = Number(student.score);
		const grade = getGrade(score);
		return {
			rank: index + 1,
			id: student.id,
			name: student.name,
			score,
			grade
		};
	});

	const total = rows.length;
	const highest = total > 0 ? rows[0].score : 0;
	const lowest = total > 0 ? rows[rows.length - 1].score : 0;
	const average = total > 0
		? rows.reduce((sum, row) => sum + row.score, 0) / total
		: 0;

	return {
		rows,
		steps: quickSortSteps,
		stats: {
			total,
			comparisons: stats.comparisons,
			swaps: stats.swaps,
			highest,
			lowest,
			average
		}
	};
}

function renderQuickSortSteps(steps, totalStudents) {
	if (totalStudents <= 1) {
		stopQuickSortAutoPlay();
		quickSortStepsState = [];
		currentStepIndex = 0;
		quicksortStepsPanel.innerHTML = `
			<h2 class="quick-title">QuickSort Visualization</h2>
			<p class="quick-subtitle">Add at least 2 students to show partition steps.</p>
			<p class="quick-empty">Not enough data to demonstrate recursive partitioning.</p>
		`;
		return;
	}

	quickSortStepsState = steps;
	currentStepIndex = Math.max(0, Math.min(currentStepIndex, quickSortStepsState.length - 1));

	const currentStep = quickSortStepsState[currentStepIndex];
	const isPrevDisabled = currentStepIndex === 0;
	const isNextDisabled = currentStepIndex === quickSortStepsState.length - 1;
	const isAutoPlaying = Boolean(quickSortAutoPlayTimer);

	quicksortStepsPanel.innerHTML = `
		<h2 class="quick-title">QuickSort Visualization</h2>
		<p class="quick-subtitle">Step ${currentStepIndex + 1} of ${quickSortStepsState.length}</p>
		<div class="quick-controls">
			<button type="button" class="quick-nav-btn" data-nav="prev" ${(isPrevDisabled || isAutoPlaying) ? 'disabled' : ''}>Previous</button>
			<button type="button" class="quick-nav-btn" data-nav="next" ${(isNextDisabled || isAutoPlaying) ? 'disabled' : ''}>Next</button>
			<button type="button" class="quick-nav-btn quick-play-btn" data-nav="toggle-auto" ${quickSortStepsState.length <= 1 ? 'disabled' : ''}>${isAutoPlaying ? 'Pause' : 'Auto Play'}</button>
		</div>
		<div class="quick-list">
			<article class="quick-step quick-step-active">
				<p class="quick-step-head">Step ${currentStepIndex + 1}: range [${currentStep.low}..${currentStep.high}], pivot = ${currentStep.pivotValue}</p>
				<p class="quick-step-body">Pivot final index: ${currentStep.pivotIndex} | Segment now: ${currentStep.rangeSnapshot}</p>
			</article>
		</div>
	`;
}

function onQuickSortNavClick(event) {
	const target = event.target;
	if (!(target instanceof HTMLElement)) {
		return;
	}

	const navButton = target.closest('.quick-nav-btn');
	if (!navButton || navButton.hasAttribute('disabled') || quickSortStepsState.length === 0) {
		return;
	}

	const direction = navButton.dataset.nav;
	if (direction === 'toggle-auto') {
		if (quickSortAutoPlayTimer) {
			stopQuickSortAutoPlay();
		} else {
			if (currentStepIndex >= quickSortStepsState.length - 1) {
				currentStepIndex = 0;
			}
			startQuickSortAutoPlay();
		}

		renderQuickSortSteps(quickSortStepsState, students.length);
		return;
	}

	stopQuickSortAutoPlay();
	if (direction === 'prev') {
		currentStepIndex = Math.max(0, currentStepIndex - 1);
	}
	if (direction === 'next') {
		currentStepIndex = Math.min(quickSortStepsState.length - 1, currentStepIndex + 1);
	}

	renderQuickSortSteps(quickSortStepsState, students.length);
}

function renderStats(sortStats) {
	statsPanel.innerHTML = `
		<div class="stats-grid">
			<div class="stat-item"><span class="stat-label">Total Students</span><span class="stat-value">${sortStats.total}</span></div>
			<div class="stat-item"><span class="stat-label">Comparisons</span><span class="stat-value">${sortStats.comparisons}</span></div>
			<div class="stat-item"><span class="stat-label">Swaps</span><span class="stat-value">${sortStats.swaps}</span></div>
			<div class="stat-item"><span class="stat-label">Highest Score</span><span class="stat-value">${sortStats.highest}</span></div>
			<div class="stat-item"><span class="stat-label">Lowest Score</span><span class="stat-value">${sortStats.lowest}</span></div>
			<div class="stat-item"><span class="stat-label">Class Average</span><span class="stat-value">${formatNumber(sortStats.average)}</span></div>
		</div>
	`;
}

function renderTable(rows) {
	if (rows.length === 0) {
		tableBody.innerHTML = '<tr><td class="empty-row" colspan="5">No students added yet.</td></tr>';
		return;
	}

	tableBody.innerHTML = rows
		.map((row) => `
			<tr>
				<td>${row.rank}</td>
				<td>${row.name}</td>
				<td>${row.score}</td>
				<td><span class="grade-pill ${row.grade.className}">${row.grade.label}</span></td>
				<td><button class="delete-btn" data-id="${row.id}" type="button" aria-label="Delete ${row.name}">Delete</button></td>
			</tr>
		`)
		.join('');
}

function render() {
	const { rows, stats, steps } = buildSortedRows(students);
	stopQuickSortAutoPlay();
	currentStepIndex = 0;
	lastSortedRows = rows;
	renderTable(rows);
	renderStats(stats);
	renderQuickSortSteps(steps, rows.length);
}

function onFormSubmit(event) {
	event.preventDefault();

	const validation = validateInputs(nameInput.value, scoreInput.value);
	if (!validation.valid) {
		formMessage.textContent = validation.message;
		return;
	}

	addStudent({
		name: validation.name,
		score: validation.score
	});

	students = getStudents();
	form.reset();
	formMessage.textContent = '';
	render();
}

function onDeleteClick(event) {
	const target = event.target;
	if (!(target instanceof HTMLElement)) {
		return;
	}

	const button = target.closest('.delete-btn');
	if (!button) {
		return;
	}

	const { id } = button.dataset;
	if (!id) {
		return;
	}

	removeStudent(id);
	students = getStudents();
	render();
}

function toCsvValue(value) {
	const text = String(value);
	const escaped = text.replace(/"/g, '""');
	return `"${escaped}"`;
}

function exportCsv() {
	if (lastSortedRows.length === 0) {
		formMessage.textContent = 'Add students before exporting CSV.';
		return;
	}

	const lines = [
		'Rank,Name,Score,Grade',
		...lastSortedRows.map((row) => [
			row.rank,
			toCsvValue(row.name),
			row.score,
			row.grade.label
		].join(','))
	];

	const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = `student_scores_${Date.now()}.csv`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

function onClearAll() {
	clearAll();
	students = [];
	formMessage.textContent = '';
	render();
}

document.addEventListener('DOMContentLoaded', () => {
	students = getStudents();
	render();

	form.addEventListener('submit', onFormSubmit);
	tableBody.addEventListener('click', onDeleteClick);
	clearButton.addEventListener('click', onClearAll);
	exportButton.addEventListener('click', exportCsv);
	quicksortStepsPanel.addEventListener('click', onQuickSortNavClick);
});
