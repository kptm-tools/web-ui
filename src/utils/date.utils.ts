export function formatTableDate(date: string): string {
  const now = new Date(date);
  const formattedDate = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
  return formattedDate;
}

export function formatHostDate(dateString: string | undefined): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
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
