/*
QuickSort is a classic divide-and-conquer sorting algorithm.

1) Divide:
   - Pick a pivot value from the array (in this implementation, the last element).
   - Rearrange the array so values greater than or equal to pivot are on the left,
	 and smaller values are on the right (descending order).

2) Conquer:
   - Recursively apply the same partitioning process to the left sub-array
	 and then to the right sub-array.

3) Combine:
   - No explicit merge step is needed because partitioning is done in-place.

Partition process used here (Lomuto scheme, descending order):
   - Let pivot = array[high][key] where high is the current segment end index.
   - Start i at low - 1. i tracks the end of the "greater-or-equal" section.
   - Move j from low to high - 1:
	   * Compare array[j][key] with pivot.
	   * If array[j][key] >= pivot, increment i and swap array[i] with array[j].
   - After the loop, swap array[i + 1] with pivot element at high.
   - The pivot is now in its final correct position.

Complexity:
   - Average time: O(n log n)
   - Worst-case time: O(n^2) (for example, already ordered data with poor pivot splits)
   - Space: O(log n) due to recursion stack on average

Why choose QuickSort here:
   - Excellent practical performance for in-memory arrays
   - In-place partitioning minimizes extra memory usage
   - Clear recursive flow makes it suitable for algorithm demonstrations
*/

function partition(array, low, high, key, stats) {
	const pivotValue = Number(array[high][key]);
	let i = low - 1;

	for (let j = low; j < high; j += 1) {
		stats.comparisons += 1;

		if (Number(array[j][key]) >= pivotValue) {
			i += 1;
			if (i !== j) {
				[array[i], array[j]] = [array[j], array[i]];
				stats.swaps += 1;
			}
		}
	}

	const pivotIndex = i + 1;
	if (pivotIndex !== high) {
		[array[pivotIndex], array[high]] = [array[high], array[pivotIndex]];
		stats.swaps += 1;
	}

	return pivotIndex;
}

function quickSortRecursive(array, low, high, key, stats) {
	if (low < high) {
		const pivotIndex = partition(array, low, high, key, stats);
		quickSortRecursive(array, low, pivotIndex - 1, key, stats);
		quickSortRecursive(array, pivotIndex + 1, high, key, stats);
	}
}

export function quickSort(array, key, stats = { comparisons: 0, swaps: 0 }) {
	if (!Array.isArray(array) || array.length <= 1) {
		return array;
	}

	quickSortRecursive(array, 0, array.length - 1, key, stats);
	return array;
}
