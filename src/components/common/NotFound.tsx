import Link from "next/link";
const NotFound = () => {
  return (
    <div className="not-found">
      <h1>We couldn't find that :( </h1>
      <Link href={"/"}>Go home</Link>
    </div>
  );
};

export default NotFound;
