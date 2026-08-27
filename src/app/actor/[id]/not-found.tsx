import Link from "next/link";

export default function ActorNotFound() {
  return (
    <div className="wrapper flex-col-center gap-3 text-center min-h-[50vh] justify-center">
      <i className="bi bi-person-x text-5xl text-content-third"></i>
      <h1 className="text-[125%] font-semibold">We couldn't find that actor</h1>
      <p className="text-content-secondary">The profile you're looking for doesn't exist or may have been removed.</p>
      <Link href="/" className="btn-primary mt-2">
        Go home
      </Link>
    </div>
  );
}
