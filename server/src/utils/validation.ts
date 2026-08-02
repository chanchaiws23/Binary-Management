type ValidationResult<T> = { value: T; error?: never } | { error: string; value?: never };

export function readRequiredString(
  value: unknown,
  fieldName: string,
  maxLength = 120
): ValidationResult<string> {
  if (typeof value !== "string") {
    return { error: `${fieldName} is required` };
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return { error: `${fieldName} is required` };
  }

  if (trimmedValue.length > maxLength) {
    return { error: `${fieldName} must be ${maxLength} characters or fewer` };
  }

  return { value: trimmedValue };
}

export function readOptionalYear(value: unknown): ValidationResult<number | null> {
  if (value === undefined || value === null || value === "") {
    return { value: null };
  }

  const year = Number(value);
  const currentYear = new Date().getFullYear();

  if (!Number.isInteger(year) || year < 0 || year > currentYear) {
    return { error: `Published year must be a whole number from 0 to ${currentYear}` };
  }

  return { value: year };
}
