export function isValidStudentId(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
