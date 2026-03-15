const STUDENTS_KEY = 'students';

export function getStudents() {
	try {
		const raw = localStorage.getItem(STUDENTS_KEY);
		if (!raw) {
			return [];
		}

		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		return [];
	}
}

export function saveStudents(students) {
	localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function addStudent(student) {
	const students = getStudents();
	const newStudent = {
		id: Date.now(),
		name: student.name,
		score: Number(student.score)
	};

	students.push(newStudent);
	saveStudents(students);
	return newStudent;
}

export function removeStudent(id) {
	const students = getStudents();
	const nextStudents = students.filter((student) => Number(student.id) !== Number(id));
	saveStudents(nextStudents);
}

export function clearAll() {
	localStorage.removeItem(STUDENTS_KEY);
}
