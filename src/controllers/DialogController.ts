export default class DialogController {
  static ref: any;
  static setRef = (ref: any) => (this.ref = ref);

  static showDialog = (
    title?: string,
    desciption?: string,
    callback?: (args?: any) => any | void
  ) => this.ref.current?.showDialog(title, desciption, callback);
}
