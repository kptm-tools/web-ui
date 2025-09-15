export function formatTableDate(date: string): string {
  const now = new Date(date);
  const formattedDate = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
  return formattedDate;
}

export function formatDateTimeToServer(
  dateFormat: string | null = '',
  timeFormat: string | null = ''
): string | null {
  if (dateFormat && timeFormat) {
    const [year, month, day] = dateFormat.split('/').map(Number);
    const [hours, minutes] = timeFormat.split(':').map(Number);
    const date =
      dateFormat !== '' && dateFormat
        ? new Date(year || 0, (month || 0) - 1, day, hours, minutes, 0, 0)
        : new Date();
    const formattedDate = date.toISOString();
    return formattedDate;
  } else {
    return null;
  }
}
