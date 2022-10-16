import icons from 'url:../../img/icons.svg';

export default class View {
    _data;

  render(data, render = true) {
    if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError()
    this._data = data;
    const markup = this._generateMarkup();
    if(!render) return markup
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  update(data){
    this._data = data;
    const newMarkup = this._generateMarkup();
    //creato un dom virtuale
    const newDom = document.createRange().createContextualFragment(newMarkup)
    //seleziono tutti gli elementi del dom virtuale e converto in array
    const newElements = Array.from(newDom.querySelectorAll("*"))
    //seleziono tutti gli elementi del dom reale per confrontarli e converto in array
    const curElements = Array.from(this._parentElement.querySelectorAll("*"))

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //update change text
      //se il nuovo elemento è diverso a quello corrente e se il testo è diverso da null
      if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ""){
        //modifica il corrente col nuovo
        curEl.textContent = newEl.textContent;
      }
      //update change attribites
      if(!newEl.isEqualNode(curEl)){
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value)
        })
      }
    })
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>  
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
