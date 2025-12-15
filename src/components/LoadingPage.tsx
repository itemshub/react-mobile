export const LoadingPage = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent">
        <div
          className="h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin"
          aria-label="Loading"
        />
      </div>
    );
}