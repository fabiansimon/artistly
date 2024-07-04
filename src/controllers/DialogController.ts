export default class DialogController {
  static ref: any;
  static setRef = (ref: any) => (this.ref = ref);

  static showDialog = (
    title?: string,
    desciption?: string,
    callback?: (args?: any) => any | void
  ) => this.ref.current?.showDialog(title, desciption, callback);

  static showCustomDialog = (children: React.ReactNode) =>
    this.ref.current?.showCustomDialog(children);
  static closeDialog = () => this.ref.current?.closeDialog();
}
