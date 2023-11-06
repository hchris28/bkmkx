import { useState } from 'react'
import css from './index.module.css'

type FormData = {
	name: '',
	url: '',
	tags: []
}

function AddBookmarkForm() {

	const [formData, setFormData] = useState<FormData>({ name: '', url: '', tags: [] })

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const rawResponse = await fetch('/api/add', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});
		const content = await rawResponse.json();
		console.log(content);
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

export default AddBookmarkForm