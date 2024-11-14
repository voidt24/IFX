export type errorMessageType = {
  active: false;
  text: "";
}

export default function Error({ errorMessage }: { errorMessage: errorMessageType }) {
  return <span id="error">{errorMessage.text}</span>;
}
