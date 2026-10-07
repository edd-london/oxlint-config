export function formatDate(date) {
  try {
    return new Intl.DateTimeFormat('en-GB').format(date);
  } catch (exception) {
    console.error(exception);
    return '';
  }
}
