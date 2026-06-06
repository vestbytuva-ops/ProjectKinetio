const defaultSubjects = [
	'Matematikk', 'Norsk muntlig', 'Norsk skriftlig', 'Norsk sidemål', 'Mat og helse',
	'Engelsk', 'Kunst og håndverk', 'Samfunnsfag', 'KRLE', 'Naturfag', 'Kroppsøving', 'Musikk'
];

let subjects = [];

function createSubject(name, id) {
	return { id, name, standpunkt: null, eksamen: null };
}

function render() {
	const container = document.getElementById('subjects');
	container.innerHTML = '';

	const header = document.createElement('div');
	header.className = 'subjects-header';
	header.innerHTML = '<div class="col-subject">Fag</div><div class="col">Standpunktskarakter</div><div class="col">Eksamenskarakter</div><div class="col">Fjern fag</div>';
	container.appendChild(header);

	subjects.forEach(s => {
		const row = document.createElement('div');
		row.className = 'subject-row';

		const nameCol = document.createElement('div');
		nameCol.className = 'col-subject';
		nameCol.textContent = s.name;

		const spCol = document.createElement('div');
		spCol.className = 'col';
		for (let i = 1; i <= 6; i++) {
			const input = document.createElement('input');
			input.type = 'radio';
			input.name = `sp-${s.id}`;
			input.value = i;
			input.id = `sp-${s.id}-${i}`;
			if (s.standpunkt == i) input.checked = true;
			input.addEventListener('change', () => {
				s.standpunkt = parseInt(input.value);
				calculateAverage();
			});

			const label = document.createElement('label');
			label.htmlFor = input.id;
			label.textContent = i;
			spCol.appendChild(input);
			spCol.appendChild(label);
		}

		const exCol = document.createElement('div');
		exCol.className = 'col';
		for (let i = 1; i <= 6; i++) {
			const input = document.createElement('input');
			input.type = 'radio';
			input.name = `ex-${s.id}`;
			input.value = i;
			input.id = `ex-${s.id}-${i}`;
			if (s.eksamen == i) input.checked = true;
			input.addEventListener('change', () => {
				s.eksamen = parseInt(input.value);
				calculateAverage();
			});

			const label = document.createElement('label');
			label.htmlFor = input.id;
			label.textContent = i;
			exCol.appendChild(input);
			exCol.appendChild(label);
		}

		const remCol = document.createElement('div');
		remCol.className = 'col';
		const btn = document.createElement('button');
		btn.className = 'remove';
		btn.textContent = '✕';
		btn.addEventListener('click', () => {
			subjects = subjects.filter(x => x.id !== s.id);
			render();
			calculateAverage();
		});
		remCol.appendChild(btn);

		row.appendChild(nameCol);
		row.appendChild(spCol);
		row.appendChild(exCol);
		row.appendChild(remCol);
		container.appendChild(row);
	});
}

function calculateAverage() {
	const values = [];
	subjects.forEach(s => {
		if (s.eksamen) values.push(s.eksamen);
		else if (s.standpunkt) values.push(s.standpunkt);
	});

	updateSummary(values);
}

function updateSummary(values) {
	const avgEl = document.getElementById('average');
	const highestEl = document.getElementById('highest');
	const lowestEl = document.getElementById('lowest');
	const withoutExamEl = document.getElementById('without-exam');
	const compEl = document.getElementById('comp-points');

	if (!values || values.length === 0) {
		avgEl.textContent = '0.00';
		highestEl.textContent = '—';
		lowestEl.textContent = '—';
		withoutExamEl.textContent = '0 fag';
		compEl.textContent = '0.0';
		return;
	}

	const sum = values.reduce((a, b) => a + b, 0);
	const avg = sum / values.length;
	avgEl.textContent = avg.toFixed(2);
	highestEl.textContent = Math.max(...values);
	lowestEl.textContent = Math.min(...values);

	const withoutExamCount = subjects.filter(s => !s.eksamen).length;
	withoutExamEl.textContent = `${withoutExamCount} ${withoutExamCount === 1 ? 'fag' : 'fag'}`;

	const comp = avg * 10;
	compEl.textContent = comp.toFixed(1);
}

function addSubjectFromInput() {
	const input = document.getElementById('new-subject');
	const name = input.value.trim();
	if (!name) return;
	const id = Date.now();
	subjects.push(createSubject(name, id));
	input.value = '';
	render();
}

document.addEventListener('DOMContentLoaded', () => {
	let idCounter = 1;
	subjects = defaultSubjects.map(name => createSubject(name, idCounter++));
	render();
	calculateAverage();

	document.getElementById('add-subject').addEventListener('click', addSubjectFromInput);
	document.getElementById('new-subject').addEventListener('keyup', (e) => {
		if (e.key === 'Enter') addSubjectFromInput();
	});
});

