import { useContext } from 'react';
import { AppStateContext } from '../../contexts/app-state-context';
// import useBookmarks from '../../hooks/use-bookmarks';
import css from './index.module.css'
import { ObjectId } from "mongodb";

interface BookmarkCardProps {
	_id: ObjectId
	text: string
	url: string
}

function BookmarkCard({ _id, text, url }: BookmarkCardProps) {

	const { isEditing } = useContext(AppStateContext)
	// const { editBookmark, deleteBookmark } = useBookmarks()

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		if (!isEditing) {
			window.open(url, '_blank')
		}
	}

	const handleEditClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		// TODO: show edit form
	}

	const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		// TODO: delete bookmark, show toast, reset command
	}

	return (
		<div className={css.bookmark} onClick={handleClick}>
			{isEditing && (
				<div className={css.bookmarkActions}>
					<button onClick={handleEditClick}>E</button>
					<button onClick={handleDeleteClick}>X</button>
				</div>
			)}
			<p className={css.bookmarkName}>{text}</p>
		</div>
	)
}

export default BookmarkCard