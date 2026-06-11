export function WorkspaceSplit({
  form,
  list,
}: {
  form: React.ReactNode;
  list: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 min-h-0 divide-x divide-border overflow-hidden">
      <div className="w-80 shrink-0 overflow-y-auto px-6 pb-6 bg-muted/30 backdrop-blur-md">
        {form}
      </div>
      <div className="flex-1 overflow-y-auto">{list}</div>
    </div>
  );
}
