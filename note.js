const Note = {
	// id для следующих заметок
	idCounter: 9,
	// элемент, который перетаскиваем
	dragged: null,

	// прослушка на заметке dblclick для редактирования и blur для прекращения
	process (noteElement) {
		noteElement.addEventListener('dblclick', function (event) {
			noteElement.setAttribute('contenteditable', 'true')
			noteElement.removeAttribute('draggable')
			// ищем колонку по родительским элементам
			noteElement.closest('.column').removeAttribute('draggable')
			noteElement.focus()
		})
		
		noteElement.addEventListener('blur', function (event) {
			noteElement.removeAttribute('contenteditable')
			noteElement.setAttribute('draggable', 'true')
			noteElement.closest('.column').setAttribute('draggable', 'true')
		
			// если при потере фокуса у карточки нет контента, то она удаляется
			if (!noteElement.textContent.trim().length) {
				noteElement.remove()
			}
		})
		
		noteElement.addEventListener('dragstart', Note.dragstart) 
		noteElement.addEventListener('dragend', Note.dragend) 
		noteElement.addEventListener('dragenter', Note.dragenter) 
		noteElement.addEventListener('dragover', Note.dragover) 
		noteElement.addEventListener('dragleave', Note.dragleave) 
		noteElement.addEventListener('drop', Note.drop)
	},

	// начало перетаскивания элемента
	dragstart (event) {
		Note.dragged = this
		this.classList.add('dragged')
	},
	
	// конец перетаскивания элемента
	dragend (event) {
		Note.dragged = null
		this.classList.remove('dragged')
		
		document
			.querySelectorAll('.note')
			.forEach(x => x.classList.remove('under'))
	},
	
	// заносим перетаскиваемый элемент над другим элементом
	dragenter (event) {
		if (this === Note.dragged) {
			return
		}
		
		this.classList.add('under')
	},
	
	dragover (event) {
		event.preventDefault()
		if (this === Note.dragged) {
			return
		}
		event.stopPropagation()
	},
	
	// выносим перетаскиваемый элемент из другого элемента
	dragleave (event) {
		if (this === Note.dragged) {
			return
		}
		this.classList.remove('under')
	},
	
	// отпускаем мышку над этим элементом
	drop (event) {
		event.stopPropagation()
		
		if (this === Note.dragged) {
			return
		}
		// если переносим в этот же столбец - меняем порядок карточек
		if (this.parentElement === Note.dragged.parentElement) {
			// находим все элементы в столбце и превращаем в массив
			const note = Array.from(this.parentElement.querySelectorAll('.note'))
			const indexA = note.indexOf(this)
			const indexB = note.indexOf(Note.dragged)
		
			// меняем порядок соседних карточек в зависимости от перетаскивания 
			if (indexA < indexB) {
				this.parentElement.insertBefore(Note.dragged, this)
				console.log('1')
			}
			else {
				this.parentElement.insertBefore(Note.dragged, this.nextElementSibling)
				console.log('2')
			}
		}
		// если другой столбец, то вставляем перед той карточкой, над которой дропнули
		else {
			this.parentElement.insertBefore(Note.dragged, this)
		}
	}
}




