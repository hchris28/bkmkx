import css from './index.module.css'

interface BookmarkCardProps {
	text: string
	url: string
}

function BookmarkCard({ text, url }: BookmarkCardProps) {
	return (
		<div className={css.bookmark}>
			<a href={url} target="_blank">{text}</a>
		</div>
	)
}

export default BookmarkCard