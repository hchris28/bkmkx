import { useContext } from 'react'
import { AppStateContext } from '../../contexts/app-state-context'
import type { Bookmark } from '../../../types/bookmark'
import BookmarkCard from '../bookmark-card'
import css from './index.module.css'

type BookmarkListProps = {
	bookmarks: Bookmark[]
}

function BookmarkList({ bookmarks }: BookmarkListProps) {

	const { command, commandActive, tagFilter, searchActive, showAll } = useContext(AppStateContext)

	const filteredBookmarks = bookmarks.filter((bookmark: Bookmark) => {
		if (showAll) {
			return true
		}
		if (!command) {
			return false
		}
		if (commandActive && tagFilter) {
			return bookmark.tags.includes(tagFilter)
		}
		if (searchActive) {
			const lowerSearch = command.toLowerCase()
			const lowerName = bookmark.name.toLowerCase()
			const lowerLink = bookmark.link.toLowerCase()
	
			return lowerName.includes(lowerSearch) || lowerLink.includes(lowerSearch)
		}
	})

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