function Footer() {
  return (
    <footer className="max-sm:hidden bg-black/50 shadow-sm text-content-muted py-4 text-center mt-10 relative">
      <span className="text-[70%] ">
        © {new Date().getFullYear().toString()}{" "}
        <a href="/" className="hover:underline">
          IFX
        </a>
      </span>
    </footer>
  );
}

export default Footer;
