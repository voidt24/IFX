export type errorMessageType = {
  active: boolean;
  text: string;
};

export default function Error({ errorMessage }: { errorMessage: errorMessageType }) {
  return (
    <span id="error" className="text-red-600 text-center text-[80%]">
      {errorMessage.text}
    </span>
  );
}
