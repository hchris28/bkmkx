import { useContext, useEffect } from 'react'
import { AppStateContext } from '../../contexts/app-state-context'
import type { Bookmark } from '../../../types/bookmark'
import BookmarkCard from '../bookmark-card'
import css from './index.module.css'

type BookmarkListProps = {
	bookmarks: Bookmark[]
}

function BookmarkList({ bookmarks }: BookmarkListProps) {

	const { command, searchActive, showAll, executeCommand } = useContext(AppStateContext)
	
	if (!searchActive && !showAll) {
		return null
	}

	const filteredBookmarks = bookmarks.filter((bookmark: Bookmark) => {
		if (showAll) {
			return true
		}
		if (!command) {
			return false
		}
		const lowerSearch = command.toLowerCase()
		const lowerName = bookmark.name.toLowerCase()
		const lowerLink = bookmark.link.toLowerCase()

		return lowerName.includes(lowerSearch) || lowerLink.includes(lowerSearch)
	})

	useEffect(() => {
		if (searchActive && filteredBookmarks.length === 1) {
			window.open(filteredBookmarks[0].link, '_blank')
			executeCommand('/reset')
		}
	}, [filteredBookmarks])

	return (
		<div className={css.bookmarkList}>
			{filteredBookmarks.map((bookmark: Bookmark) => (
				<BookmarkCard 
					key={bookmark._id.toString()} 
					_id={bookmark._id}
					text={bookmark.name} 
					url={bookmark.link}
				/>
			))}
		</div>
	)
}

export default BookmarkList