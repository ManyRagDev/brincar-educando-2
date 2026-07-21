export function resolveActiveChild<T extends { id: string }>(
  children: T[],
  requestedChildId?: string,
) {
  const requestedChild = children.find((child) => child.id === requestedChildId);
  const activeChild = requestedChild ?? (children.length === 1 ? children[0] : null);

  return {
    activeChild,
    needsSelection: children.length > 1 && !activeChild,
  };
}

