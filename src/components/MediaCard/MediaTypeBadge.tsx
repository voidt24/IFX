function MediaTypeBadge({ mediaType }: { mediaType: string }) {
  return <span className={`mediatype z-[2] absolute top-[3px] right-[5px] rounded-sm px-1.5 ${mediaType == "tv" ? "bg-green-600/70" : "bg-blue-600/70"}`}>{mediaType.toUpperCase()}</span>;
}

export default MediaTypeBadge;
