interface FormHelperTextListProps {
  items: string[] | undefined;
}

export default function FormHelperTextList({ items }: FormHelperTextListProps) {
  return <>{items?.map((error) => <span key={error}>{error}</span>)}</>;
}
