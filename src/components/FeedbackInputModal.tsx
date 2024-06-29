import Modal from './Modal';

export default function FeedbackInputModal({
  isVisible,
  onRequestClose,
}: {
  isVisible: boolean;
  onRequestClose?: () => void;
}) {
  return (
    <Modal isVisible={isVisible}>
      <div></div>
    </Modal>
  );
}
