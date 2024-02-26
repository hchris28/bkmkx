import { useContext } from 'react';
import type { Bookmark } from '../../../types/bookmark'
import { CommandContext } from '../../contexts/command-context';
import BookmarkCard from '../bookmark-card'
import css from './index.module.css'
import classNames from 'classnames/bind';

const cx = classNames.bind(css);

type BookmarkListProps = {
	bookmarks: Bookmark[],
	filter?: string,
}

function BookmarkList({ bookmarks }: BookmarkListProps) {

	const { commandArgs } = useContext(CommandContext)
	const listShouldBeGrouped = commandArgs.some(a => a.type === 'option' && a.switch === 'g')
	const listAll = !commandArgs.some(a => a.type === 'default')

	if (bookmarks.length === 0) {
		return null;
	}

	let groups: string[] = [];
	if (listShouldBeGrouped) {
		bookmarks.forEach((bookmark: Bookmark) => {
			bookmark.tags.forEach((tag: string) => {
				const tagSegments = tag.split('/')
				const tagGroup = listAll
					?	tagSegments[0]
					: tagSegments.length == 2 ? tagSegments[1] : ''
				if (tagGroup && !groups.includes(tagGroup)) {
					groups.push(tagGroup);
				}
			})
		})
	} else {
		groups = ['']; // any value will do here, we just need a single element array
	}

	const ungroupedBookmarks = listShouldBeGrouped
		? (
			bookmarks.filter((bookmark: Bookmark) => {
				return bookmark.tags.length === 0
					|| bookmark.tags.some((tag: string) => tag.split('/').length === 1);
			})
		)
		: []

	const goupFilter = (bookmark: Bookmark, tagGroup: string) => {
		if (!listShouldBeGrouped)
			return true

		return listAll
			? bookmark.tags.some(t => t.startsWith(tagGroup))
			: bookmark.tags.some(t => t.endsWith('/' + tagGroup))
	}

	return (
		<div className={cx(css.bookmarkList, { 'bookmarkListGrouped': listShouldBeGrouped })}>
			{groups.sort().map((tagGroup: string) => (
				<section key={tagGroup} className={css.tagGroup}>
					<h2>{tagGroup}</h2>
					<div className={css.bookmarkCards}>
						{bookmarks
							.filter((bookmark: Bookmark) => goupFilter(bookmark, tagGroup))
							.map((bookmark: Bookmark) => (
								<BookmarkCard
									key={bookmark._id.toString()}
									_id={bookmark._id}
									text={bookmark.name}
									url={bookmark.link}
								/>
							))
						}
					</div>
				</section>
			))}
			{listShouldBeGrouped && ungroupedBookmarks.length > 0 && (
				<section className={css.tagGroup}>
					<h2>Everything Else</h2>
					<div className={css.bookmarkCards}>
						{ungroupedBookmarks.map((bookmark: Bookmark) => (
							<BookmarkCard
								key={bookmark._id.toString()}
								_id={bookmark._id}
								text={bookmark.name}
								url={bookmark.link}
							/>
						))}
					</div>
				</section>
			)}
		</div>
	)
}

export default BookmarkList