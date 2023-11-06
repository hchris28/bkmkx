import css from './index.module.css'

interface BookmarkProps {
	text: string
	url: string
}

function Bookmark({ text, url }: BookmarkProps) {
	return (
		<div className={css.bookmark}>
			<a href={url} target="_blank">{text}</a>
		</div>
	)
}

export default Bookmark