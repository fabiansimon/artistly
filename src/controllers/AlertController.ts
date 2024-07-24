export default class AlertController {
  static ref: any;
  static setRef = (ref: any) => (this.ref = ref);

  static show = ({
    title,
    description,
    callback,
    buttonText,
    optimistic,
  }: {
    title?: string;
    description?: string;
    callback?: (args?: any) => any | void;
    buttonText?: string;
    optimistic?: boolean;
  }) =>
    this.ref.current?.show({
      title,
      description,
      callback,
      buttonText,
      optimistic,
    });
}
