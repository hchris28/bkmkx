import { ReactNode } from 'react'
import css from './index.module.css'

interface BookmarkCardProps {
	children: ReactNode
}

function InlineErrorMessage({ children, ...rest } : BookmarkCardProps) {
	return (
		<div className={css.inlineErrorMessage} {...rest}>
			{children}
		</div>
	);
}

export default InlineErrorMessage;