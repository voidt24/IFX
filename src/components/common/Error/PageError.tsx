function PageError({ containerMargin }: { containerMargin: number }) {
  return (
    <div className="text-center p-10" style={{ marginTop: containerMargin ? `${containerMargin}px` : undefined }}>
      <h1 className="text-[125%]">There was an error loading the data</h1>
      <p>Please refresh the page to try again</p>
    </div>
  );
}

export default PageError;
