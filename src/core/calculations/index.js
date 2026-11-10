export function calculateBMI(weight, height) {
  if (!weight || !height) {
    return 0;
  }

  return Number((weight / (height * height)).toFixed(2));
}
