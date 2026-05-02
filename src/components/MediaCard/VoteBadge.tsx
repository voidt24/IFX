function VoteBadge({ vote }: { vote: string | undefined }) {
  return (
    <div className={`flex-row-center gap-1 vote`}>
      <>
        <i className="bi bi-star-fill text-[#c0972e] text-[80%] cursor-default"></i>
        <p>{vote || 0}</p>
      </>
    </div>
  );
}

export default VoteBadge;
