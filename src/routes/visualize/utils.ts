export function percent(value: number, total = 1): string {
	return ((value / total) * 100).toFixed(1) + '%';
}
