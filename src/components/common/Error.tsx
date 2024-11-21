export type errorMessageType = {
  active: boolean;
  text: string;
};

export default function Error({ errorMessage }: { errorMessage: errorMessageType }) {
  return <span id="error">{errorMessage.text}</span>;
}
