import { ReactNode } from 'react'
import css from './index.module.css'

interface InlineErrorMessageProps {
	children: ReactNode
}

function InlineErrorMessage({ children, ...rest } : InlineErrorMessageProps) {
	return (
		<div className={css.inlineErrorMessage} {...rest}>
			{children}
		</div>
	);
}

export default InlineErrorMessage;