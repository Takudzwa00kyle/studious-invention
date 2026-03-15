# Student Score Tracker - Using QuickSort

A simple web app that stores student scores, sorts them with QuickSort, and assigns grades and ranks.

## Features

- Add students with name and score validation (0-100)
- Persist data in browser `localStorage` (key: `students`)
- Sort students by score (descending) using QuickSort
- Display rank, score, and grade for each student
- Remove individual students
- Clear all records instantly
- Export ranked results as CSV
- Show QuickSort stats (comparisons and swaps) plus class statistics

## Grading Table

| Score Range | Grade |
|-------------|-------|
| 75-100      | 1     |
| 69-74       | 2.1   |
| 60-68       | 2.2   |
| 50-59       | P     |
| 0-49        | F     |

## Run Locally

No setup is required.

1. Download or clone the repository.
2. Open `index.html` directly in your browser.

## Deploy to GitHub Pages

1. Push the project to your GitHub repository (default branch: `main`).
2. Open repository **Settings**.
3. Go to **Pages**.
4. Set **Source** to **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`.
6. Save and wait for GitHub Pages to publish.

## QuickSort Overview

QuickSort is a divide-and-conquer sorting algorithm:

1. Choose a pivot element (this project uses the last element).
2. Partition items into two groups around the pivot.
3. Recursively sort the left and right partitions.

Complexities:

- Average time complexity: `O(n log n)`
- Worst-case time complexity: `O(n^2)`
- Space complexity: `O(log n)` recursion stack (average)

QuickSort is used here because it is efficient in practice and performs in-place partitioning.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6 modules)
- Browser `localStorage`

## File Structure

```text
Student-Score-Tracker_Using-QuickSort/
|-- index.html
|-- README.md
|-- css/
|   `-- style.css
`-- js/
	|-- app.js
	|-- quicksort.js
	`-- storage.js
```
