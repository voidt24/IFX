function MediaTypeBadge({ mediaType }: { mediaType: string }) {
  return <span className="mediatype absolute left-[5px] bottom-[12px] z-[2] rounded-full px-[0.3rem] bg-surface-modal">{mediaType}</span>;
}

export default MediaTypeBadge;
