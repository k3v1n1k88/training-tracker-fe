/** Empty state message for tables/lists. */
export default function EmptyState({ message = 'No data found' }: { message?: string }) {
  return (
    <div style={{
      textAlign: 'center', padding: '40px 20px',
      color: '#9ca3af', fontSize: 13,
    }}>
      {message}
    </div>
  )
}
