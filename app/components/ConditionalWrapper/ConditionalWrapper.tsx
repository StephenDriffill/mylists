interface ConditionalWrapperProps<T extends React.ReactNode> {
  children: T;
  showWrapper: boolean;
  wrapper: (children: T) => React.ReactNode;
}

export default function ConditionalWrapper<T extends React.ReactNode>({
  children,
  showWrapper,
  wrapper,
}: ConditionalWrapperProps<T>) {
  return showWrapper ? wrapper(children) : children;
}
