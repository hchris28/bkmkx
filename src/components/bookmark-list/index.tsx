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

function BookmarkList({ bookmarks, filter }: BookmarkListProps) {

	const { commandArgs } = useContext(CommandContext)
	const group = commandArgs.some(a => a.type === 'option' && a.switch === 'g')

	if (bookmarks.length === 0) {
		return null;
	}

	let groups: string[] = [];
	if (group) {
		bookmarks.forEach((bookmark: Bookmark) => {
			bookmark.tags.forEach((tag: string) => {
				const tagSegments = tag.split('/')
				const tagGroup = tagSegments.length == 2 ? tagSegments[1] : ''
				if (tag !== filter && tagGroup && !groups.includes(tagGroup)) {
					groups.push(tagGroup);
				}
			})
		})
	} else {
		groups = [filter || ''];
	}

	const untaggedBookmarks = group
		? (
			bookmarks.filter((bookmark: Bookmark) => {
				return bookmark.tags.length === 0;
			})
		)
		: []

	console.log(filter, bookmarks.length)

	return (
		<div className={cx(css.bookmarkList, { 'bookmarkListGrouped': group })}>
			{groups.sort().map((tag: string) => (
				<section key={tag} className={css.tagGroup}>
					<h2>{tag}</h2>
					<div className={css.bookmarkCards}>
						{bookmarks
							.filter((bookmark: Bookmark) => {
								return (groups.length === 1 && groups[0] === '')
									|| bookmark.tags.includes(tag)
							})
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
			{group && untaggedBookmarks.length > 0 && (
				<section className={css.tagGroup}>
					<h2>untagged</h2>
					<div className={css.bookmarkCards}>
						{untaggedBookmarks.map((bookmark: Bookmark) => (
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