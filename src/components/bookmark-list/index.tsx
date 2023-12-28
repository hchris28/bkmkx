import { useContext } from 'react'
import { AppStateContext, CommandState, EditFormMode } from '../../contexts/app-state-context'
import type { Bookmark } from '../../../types/bookmark'
import BookmarkCard from '../bookmark-card'
import css from './index.module.css'

type BookmarkListProps = {
	bookmarks: Bookmark[]
}

function BookmarkList({ bookmarks }: BookmarkListProps) {

	const {
		command,
		commandState,
		tagFilter,
		showAll,
		editFormMode,
	} = useContext(AppStateContext)

	if (editFormMode !== EditFormMode.Inactive 
		|| commandState === CommandState.CommandPending
		|| commandState === CommandState.CommandInvalid
	) {
		return null
	}

	const bkmkFilterFn = (bookmark: Bookmark) => {
		if (showAll) {
			return true
		}
		switch (commandState) {
			case CommandState.Empty:
				return false
			case CommandState.CommandValid:
				if (tagFilter) {
					return bookmark.tags.includes(tagFilter)
				}
				break
			case CommandState.Searching:
				const lowerSearch = command.toLowerCase()
				const lowerName = bookmark.name.toLowerCase()
				const lowerLink = bookmark.link.toLowerCase()
				return lowerName.includes(lowerSearch) || lowerLink.includes(lowerSearch)
			default:
				return false
		}
	}

	const bkmkComareFn = (a: Bookmark, b: Bookmark) => {
		const normalizedAName = a.name.toLowerCase();
		const normalizedBName = b.name.toLowerCase();

		if (normalizedAName === normalizedBName) {
			return 0
		}
		if (normalizedAName < normalizedBName) {
			return -1
		}
		return 1
	}

	const filteredBookmarks = bookmarks
		.filter(bkmkFilterFn)
		.sort(bkmkComareFn)

	const emptyResults = (commandState === CommandState.Searching && filteredBookmarks.length === 0)

	return (
		<div className={css.bookmarkList}>
			{emptyResults && filteredBookmarks.length === 0 && (
				<div className={css.noBookmarks}>
					No bookmarks found
				</div>
			)}
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