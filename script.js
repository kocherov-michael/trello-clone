Application.load()
Trash.process()

document
	.querySelector('[data-action-addColumn]')
	.addEventListener('click', function (event) {
		const column = new Column
		document.querySelector('.columns').append(column.element)

		// создали колонку - сохранили
		Application.save()
	})





