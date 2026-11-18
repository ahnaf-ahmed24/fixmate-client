
export default function AuthShell({ children }) {
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10">
      <div className="flex-1 container-page flex items-center justify-center py-10">{children}</div>
    </div>
  );
}
