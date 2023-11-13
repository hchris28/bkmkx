import { useState, useContext } from 'react'
import { AppStateContext } from '../../contexts/app-state-context'
import useBookmarks from '../../hooks/use-bookmarks'
import toast from "react-hot-toast";
import css from './index.module.css'

type FormData = {
	name: '',
	url: '',
	tags: string[]
}

function EditBookmarkForm() {

	const [formData, setFormData] = useState<FormData>({ name: '', url: '', tags: [] })
	const { addFormVisible, executeCommand } = useContext(AppStateContext)
	const { addBookmark } = useBookmarks()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		if (name === 'tags') {
			setFormData({
				...formData,
				[name]: value.split(',').map(tag => tag.trim())
			})
		} else {
			setFormData({
				...formData,
				[name]: value
			})
		}
	}
	
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		addBookmark(formData)
		executeCommand('/reset')
		toast.success('Bookmark added!')
	}

	if (!addFormVisible) {
		return null
	}

	return (
		<form className={css.formContainer} onSubmit={handleSubmit}>
			<input type="text" name="name" onChange={handleInputChange} placeholder="Name" />
			<input type="text" name="url" onChange={handleInputChange} placeholder="URL" />
			<input type="text" name="tags" onChange={handleInputChange} placeholder="Tags (optional)" />
			<button>Add Bookmark</button>
		</form>
	)
}

export default EditBookmarkForm