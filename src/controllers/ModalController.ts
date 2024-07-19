export default class ModalController {
  static ref: any;
  static setRef = (ref: any) => (this.ref = ref);

  static show = (children: React.ReactNode, ignoreDesign = false) =>
    this.ref.current?.show(children, ignoreDesign);
  static close = () => this.ref.current?.closeModal();
}
