// id для следующих клонок
let columnIdCounter = 4
// элемент, который перетаскиваем

document
	.querySelectorAll('.column')
	.forEach(columnProcess)

document
	.querySelector('[data-action-addColumn]')
	.addEventListener('click', function (event) {
		// создаём элемент колонку
		const columnElement = document.createElement('div')
		columnElement.classList.add('column')
		columnElement.setAttribute('draggable', 'true')
		columnElement.setAttribute('data-columb-id', columnIdCounter)

		columnElement.innerHTML = 
`<p class="column-header">В плане</p>
<div data-notes></div>
<p class="column-footer">
	<span data-action-addNote class="action">+ Добавить карточку</span>
</p>`

		columnIdCounter++

		document.querySelector('.columns').append(columnElement)

		columnProcess(columnElement)
	})

document
	.querySelectorAll('.note')
	.forEach(Note.process)

// прослушка кнопки добавления карточки
function columnProcess (columnElement) {
	const spanAction_addNote = columnElement.querySelector('[data-action-addNote]')

	spanAction_addNote.addEventListener('click', function (event) {
		// создаём элемент заметку
		const noteElement = document.createElement('div')
		noteElement.classList.add('note')
		noteElement.setAttribute('draggable', 'true')
		noteElement.setAttribute('data-note-id', Note.idCounter)

		Note.idCounter++
		
		columnElement.querySelector('[data-notes]').append(noteElement)
		Note.process(noteElement)

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

	// отменяем стандартную обработку при перетаскивании карточки в пустую колонку
	columnElement.addEventListener('dragover', function (event) {
		event.preventDefault()
	})

	// перетаскиваем карточку в пустую колонку
	columnElement.addEventListener('drop', function (event) {
		if (Note.dragged) {
			return columnElement.querySelector('[data-notes]').append(Note.dragged)
		}
	})
}


