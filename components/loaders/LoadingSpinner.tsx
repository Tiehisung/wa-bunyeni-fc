 
export function LoadingSpinner({ page }: { page?: boolean }) {
  return (
    <div
      className={
        `flex justify-center items-center py-6 ${page ? "min-h-screen" : ""}`
      }
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
