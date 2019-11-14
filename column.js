const Column = {
	// id для следующих клонок
	idCounter: 4,

	// перетаскиваемая колонка
	dragged: null,

	// колонка, над которой бросили
	dropped: null,

	// прослушка кнопки добавления карточки
	process (columnElement) {
		const spanAction_addNote = columnElement.querySelector('[data-action-addNote]')

		spanAction_addNote.addEventListener('click', function (event) {
			// создаём элемент заметку
			const noteElement = Note.create()
			
			columnElement.querySelector('[data-notes]').append(noteElement)

			// при создании карточки сразу идёт её редактирование
			noteElement.setAttribute('contenteditable', 'true')
			noteElement.focus()
		})

		// редактирование заголовка столбца
		const headerElement = columnElement.querySelector('.column-header')

		headerElement.addEventListener('dblclick', function (event) {
			headerElement.setAttribute('contenteditable', 'true')
			headerElement.focus()
		})

		headerElement.addEventListener('blur', function (event) {
			headerElement.removeAttribute('contenteditable')
		})

		// Прослушка перетаскивания
		columnElement.addEventListener('dragstart', Column.dragstart)
		columnElement.addEventListener('dragend', Column.dragend)

		columnElement.addEventListener('dragover', Column.dragover)

		// перетаскиваем карточку в пустую колонку
		columnElement.addEventListener('drop', Column.drop)
	},

	dragstart (event) {
		// запоминатем перетаскиваемый элемент
		Column.dragged = this
		Column.dragged.classList.add('dragged')

		event.stopPropagation()

		document
			.querySelectorAll('.note')
			.forEach(noteElement => noteElement.removeAttribute('draggable'))
	},

	dragend (event) {
		event.stopPropagation()
		// забываем перетаскиваемый элемент
		Column.dragged.classList.remove('dragged')
		Column.dragged = null
		Column.dropped = null

		document
			.querySelectorAll('.note')
			.forEach(noteElement => noteElement.setAttribute('draggable', 'true'))

		// убираем класс у всех когда бросили колонку
		document
		.querySelectorAll('.column')
		.forEach(columnElement => columnElement.classList.remove('under'))
	},

	dragover (event) {
		event.stopPropagation()
		// отменяем стандартную обработку при перетаскивании карточки в пустую колонку
		event.preventDefault()

		// Если перетаскиваем колонку над собой
		if (Column.dropped === this) {
			if (Column.dropped) {
				Column.dropped.classList.remove('under')
			}
			Column.dropped = null
		}
		
		if (!Column.dragged || Column.dragged === this) {
			return
		}
		
		Column.dropped = this

		document
			.querySelectorAll('.column')
			.forEach(columnElement => columnElement.classList.remove('under'))

		this.classList.add('under')
	},

	drop () {

		// если бросаем карточку
		if (Note.dragged) {
			return this.querySelector('[data-notes]').append(Note.dragged)
		}
		// если бросаем колонку
		else if (Column.dragged) {
			const children = Array.from(document.querySelector('.columns').children)
			const indexA = children.indexOf(this)
			const indexB = children.indexOf(Column.dragged) 

			// меняем порядок соседних колонок в зависимости от перетаскивания 
			if (indexA < indexB) {
				document.querySelector('.columns').insertBefore(Column.dragged, this)
			}
			else {
				document.querySelector('.columns').insertBefore(Column.dragged, this.nextElementSibling)
			}

		}
	},

	
}