export default function isValidMediatype(path: string) {
  return path == "movies" || path == "tvshows";
   
}

export function setMedia(path: string) {
  let pathName: string;
  
  if (path.slice(1).includes("/")) {
    pathName = path.slice(1, path.lastIndexOf("/"));
  } else {
    pathName = path.slice(1);
  }

  return pathName;
}
