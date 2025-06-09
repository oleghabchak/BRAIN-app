export const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear().toString();
  return { day, month, year };
};
