export const getStatusVariant = (status) => {
  if (status === 'completed') return 'green'
  if (status === 'failed') return 'red'
  return 'warning'
}
