export default class AlertController {
  static ref: any;
  static setRef = (ref: any) => (this.ref = ref);

  static show = ({
    title,
    description,
    callback,
  }: {
    title?: string;
    description?: string;
    callback?: (args?: any) => any | void;
  }) => this.ref.current?.show({ title, description, callback });
}
