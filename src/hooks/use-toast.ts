export function useToast() {
  const toast = ({ title, description, variant }: {
    title: string
    description?: string
    variant?: 'default' | 'destructive'
  }) => {
    // Simple alert for now - you can replace with proper toast implementation
    alert(`${title}${description ? ': ' + description : ''}`)
  }

  return { toast }
}

export { useToast as toast }