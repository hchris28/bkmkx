import { useContext } from 'react'
import { CommandContext, CommandState, Command } from '../../contexts/command-context'
import type { Bookmark } from '../../../types/bookmark'
import BookmarkCard from '../bookmark-card'
import css from './index.module.css'

type BookmarkListProps = {
	bookmarks: Bookmark[]
}

function BookmarkList({ bookmarks }: BookmarkListProps) {

	const {
		commandSource,
		commandState,
		command,
		commandArgs,
	} = useContext(CommandContext)

	const showList = (commandState === CommandState.FreeText) 
		|| (command === Command.List)
		|| (command === Command.Edit && commandArgs.length === 0)
	if (!showList) {
		return null
	}

	const showAll = (command === Command.List || command === Command.Edit) && commandArgs.length === 0
	const showTag = (command === Command.List || command === Command.Edit) && commandArgs.length === 1
	const bkmkFilterFn = (bookmark: Bookmark) => {
		if (showAll) {
			return true
		} else if (showTag) {
			return bookmark.tags.includes(commandArgs[0])
		} else if (commandState === CommandState.FreeText) {
			const lowerSearch = commandSource.toLowerCase()
			const lowerName = bookmark.name.toLowerCase()
			const lowerLink = bookmark.link.toLowerCase()
			return lowerName.includes(lowerSearch) || lowerLink.includes(lowerSearch)
		} else  {
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

	const emptyResults = (commandState === CommandState.FreeText && filteredBookmarks.length === 0)

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