import React, { useContext } from 'react'
import { AppStateContext } from '../../contexts/app-state-context'
import css from './index.module.css'

function CommandBar({}, ref: React.Ref<HTMLInputElement>) {

	const { command, executeCommand, setCommand } = useContext(AppStateContext)

	const handleCommandBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommand(e.target.value)
		if (e.target.value === '') {
			executeCommand('/reset')
		}
	}

	const handleCommandBarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			executeCommand(command)
		}
		if (e.key === 'Escape') {
			executeCommand('/reset')
		}
	}

	return (
		<div className={css.commandBar}>
			<input type="text" value={command} onChange={handleCommandBarChange} onKeyDown={handleCommandBarKeyDown} ref={ref} />
		</div>
	)
}

export default React.forwardRef<HTMLInputElement/*, CommandBarProps*/>(CommandBar)