// Shown when the API call behind a page fails (e.g. backend not running)
export default function ErrorNote({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {message}
    </p>
  );
}
