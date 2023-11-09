import React from 'react'
import css from './index.module.css'

interface CommandBarProps {
	command: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

function CommandBar({ command, onChange, onKeyDown }: CommandBarProps, ref: React.Ref<HTMLInputElement>) {
	return (
		<div className={css.commandBar}>
			<input type="text" value={command} onChange={onChange} onKeyDown={onKeyDown} ref={ref} />
		</div>
	)
}

export default React.forwardRef<HTMLInputElement, CommandBarProps>(CommandBar)