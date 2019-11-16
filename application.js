const Application = {
	// сохраняем состояние приложения
	save () {
		const object = {
			columns: {
				idCounter: Column.idCounter,
				items: []
			},
			notes: {
				idCounter: Note.idCounter,
				items: []
			}
		}

		// проходимся по всем колонкам и добавляем в массив columns.items
		document
			.querySelectorAll('.column')
			.forEach(columnElement => {
				const column = {
					title: columnElement.querySelector('.column-header').textContent,
					id: parseInt(columnElement.getAttribute('data-column-id')),
					noteIds: []
				}

				// запоминаем все id заметок, которые принадлежат колонке
				columnElement
					.querySelectorAll('.note')
					.forEach(noteElement => {
						column.noteIds.push(parseInt(noteElement.getAttribute('data-note-id')))
					})

				// запоминаем колонки
				object.columns.items.push(column)
			})

		// Проходим по всем заметкам и добавляем в массив notes.items
		document
			.querySelectorAll('.note')
			.forEach(noteElement => {
				const note = {
					id: parseInt(noteElement.getAttribute('data-note-id')),
					content: noteElement.textContent
				}

				object.notes.items.push(note)
			})

		// преобразуем object в json
		const json = JSON.stringify(object)

		// записываем json в localStorage
		localStorage.setItem('trello', json)
		
		return object
	},

	// Загружаем состояние приложения
	load () {
		if (!localStorage.getItem('trello')) {
			return
		}

		// точка монтирования
		const mountePoint = document.querySelector('.columns')
		mountePoint.innerHTML = ''

		const object = JSON.parse(localStorage.getItem('trello'))
		// пробегаемся по заметкам, и если id совпадает с искомым, заметка будет возвращена
		const getNoteById = id => object.notes.items.find(note => note.id === id)

		// пробегаемся по распарсенному объекту
		for (const column of object.columns.items) {
			const columnElement = Column.create(column.id)

			mountePoint.append(columnElement)
			// вставляем заголовок
			columnElement.querySelector('.column-header').textContent = column.title

			// пробегаемся по записям
			for (const noteId of column.noteIds) {
				const note = getNoteById(noteId)

				const noteElement = Note.create(note.id, note.content)
				// Вставляем записи в колонки
				columnElement.querySelector('[data-notes]').append(noteElement)
			}
		}
	}
}