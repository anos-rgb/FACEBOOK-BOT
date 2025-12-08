function formatDate(date) {
  return new Date(date).toLocaleString('id-ID');
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

module.exports = { formatDate, formatNumber };