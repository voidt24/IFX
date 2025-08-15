  export default function paramIsValid(param: string | null) {
    if (!param || Number(param) < 1) return false;

    if (Number.isSafeInteger(Number(param))) {
      return true;
    }
  }