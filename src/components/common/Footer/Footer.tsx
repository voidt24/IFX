function Footer() {
  return (
    <footer className=" bg-black/50 shadow-sm text-content-muted py-4 text-center mt-10 relative text-[85%] ">
      <span className="">
        ©{" "}
        <a href="/" className="hover:underline">
          IFX
        </a>
      </span>
      <p>
        &lt;&gt; by
        <span className="text-brand-primary"> Andrey T</span> {new Date().getFullYear().toString()}{" "}
      </p>
    </footer>
  );
}

export default Footer;
