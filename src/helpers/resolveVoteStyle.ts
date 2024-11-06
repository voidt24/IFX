export default function resolveVoteStyle(vote: number) {
  let style: string;

  vote == 0
    ? (style = "border-gray-700 text-white")
    : vote < 50
    ? (style = "border-red-800")
    : vote < 65
    ? (style = "border-yellow-500")
    : vote < 75
    ? (style = "border-lime-300")
    : (style = "border-green-500");

  return style;
}
