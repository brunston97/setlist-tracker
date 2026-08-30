export function FormatDate(date) {
    const [day, month, year] = date.split('-');
    return `${month}-${day}-${year}`;
}