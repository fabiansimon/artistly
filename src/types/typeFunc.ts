import { InputData } from '.';

export function inputDataEmpty(inputData: InputData): boolean {
  return (
    inputData.file === undefined ||
    (inputData.description.trim() === '' &&
      inputData.email.trim() === '' &&
      inputData.emailList.size === 0)
  );
}
