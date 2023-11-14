import { useContext } from 'react';
import { AppStateContext } from '../../contexts/app-state-context';
import useBookmarks from '../../hooks/use-bookmarks';
import css from './index.module.css'
import { ObjectId } from "mongodb";

interface BookmarkCardProps {
	_id: ObjectId
	text: string
	url: string
}

function BookmarkCard({ _id, text, url }: BookmarkCardProps) {

	const { editMode, executeCommand } = useContext(AppStateContext)
	const { deleteBookmark } = useBookmarks()

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		if (!editMode) {
			window.open(url, '_blank')
		}
	}

	const handleEditClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		executeCommand(`/edit ${_id}`)
	}

	const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		deleteBookmark(_id)
		executeCommand('/edit')
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		e.stopPropagation()
		if (e.key === 'Enter') {
			window.open(url, '_blank')
		}
	}

	return (
		<div className={css.bookmarkContainer}>
			{editMode && (
				<div className={css.bookmarkActions}>
					<button onClick={handleEditClick}>E</button>
					<button onClick={handleDeleteClick}>X</button>
				</div>
			)}
			<div
				className={css.bookmark}
				tabIndex={editMode ? -1 : 0}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				<p className={css.bookmarkName}>{text}</p>
			</div>
		</div>
	)
}

export default BookmarkCard