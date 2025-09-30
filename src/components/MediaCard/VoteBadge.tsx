function VoteBadge({ vote }: { vote: string | undefined }) {
  return (
    <div className={`absolute top-[13px] left-[5px] flex-row-center gap-1 z-[2] font-semibold rounded-full bg-surface-modal pl-[0.3rem] pr-[0.4rem] vote`}>
      <>
        <i className="bi bi-star-fill text-[goldenrod] text-[80%] cursor-default"></i>
        <p>{vote || 0}</p>
      </>
    </div>
  );
}

export default VoteBadge;
