type SpinnerProps = {
  label?: string
}

export function Spinner({ label = 'Loading…' }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
        role="status"
        aria-label={label}
      />
      <span className="text-sm">{label}</span>
    </div>
  )
}
