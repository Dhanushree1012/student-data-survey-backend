export function formatStudentName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(' ').trim();
}
