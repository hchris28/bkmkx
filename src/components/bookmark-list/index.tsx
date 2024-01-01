import type { Bookmark } from '../../../types/bookmark'
import BookmarkCard from '../bookmark-card'
import css from './index.module.css'

type BookmarkListProps = {
	bookmarks: Bookmark[]
}

function BookmarkList({ bookmarks }: BookmarkListProps) {

	return (
		<div className={css.bookmarkList}>
			{bookmarks.map((bookmark: Bookmark) => (
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