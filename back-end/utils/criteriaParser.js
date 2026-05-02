export function parseEligibilityRange(value) {
  const defaultRange = { min: 0, max: 100 };
  if (value === undefined || value === null || value === '') return defaultRange;
  if (typeof value === 'number' && !Number.isNaN(value)) return { min: value, max: value };

  const text = value.toString().replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();

  const rangeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)/i);
  if (rangeMatch) {
    const a = parseFloat(rangeMatch[1]);
    const b = parseFloat(rangeMatch[2]);
    if (!Number.isNaN(a) && !Number.isNaN(b)) {
      return { min: Math.min(a, b), max: Math.max(a, b) };
    }
  }

  const minMatch = text.match(/(?:minimum|required|min|>=|greater than or equal to|at least|no less than|above|over)\s*(\d+(?:\.\d+)?)/i);
  const maxMatch = text.match(/(?:maximum|max|<=|less than or equal to|at most|no more than|up to|below|under)\s*(\d+(?:\.\d+)?)/i);

  let min = 0;
  let max = 100;

  if (minMatch) {
    min = parseFloat(minMatch[1]);
  }
  if (maxMatch) {
    max = parseFloat(maxMatch[1]);
  }

  if (!Number.isNaN(min) && !Number.isNaN(max) && min > max) {
    [min, max] = [max, min];
  }

  if ((minMatch || maxMatch) && !Number.isNaN(min) && !Number.isNaN(max)) {
    return { min, max };
  }

  const firstNumber = text.match(/(\d+(?:\.\d+)?)/);
  if (firstNumber) {
    return { min: parseFloat(firstNumber[1]), max: 100 };
  }

  return defaultRange;
}
