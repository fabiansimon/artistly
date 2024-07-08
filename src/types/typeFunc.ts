import { ProjectInputData } from '.';

export function inputDataEmpty(inputData: ProjectInputData): boolean {
  return (
    inputData.description.trim() === '' &&
    inputData.email.trim() === '' &&
    inputData.emailList.size === 0
  );
}
