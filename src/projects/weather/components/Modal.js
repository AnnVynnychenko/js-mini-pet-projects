export class Modal {
  #modalBackdrop;
  #modalContent;

  constructor(backdropSelector, contentSelector) {
    this.#modalBackdrop = document.querySelector(backdropSelector);
    this.#modalContent = document.querySelector(contentSelector);
    this.init();
  }

  #handleBackdropClick = event => {
    const { target } = event;
    if (
      target.classList.contains('js-modal-close-btn') ||
      target.classList.contains('js-modal-backdrop')
    ) {
      this.closeModal();
    }
  };

  init() {
    this.#modalBackdrop.addEventListener(
      'click',
      this.#handleBackdropClick.bind(this)
    );
  }

  openModal(modalMarkup) {
    this.#modalContent.innerHTML = modalMarkup;
    this.#modalBackdrop.classList.remove('is-hidden');
    window.addEventListener('keydown', this.handleEscKeyPress);
  }

  closeModal() {
    this.#modalBackdrop.classList.add('is-hidden');
    window.removeEventListener('keydown', this.handleEscKeyPress);
  }

  handleEscKeyPress = event => {
    if (event.code === 'Escape') {
      this.closeModal();
    }
  };
}
