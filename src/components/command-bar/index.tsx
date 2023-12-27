import React, { useContext } from 'react'
import { AppStateContext } from '../../contexts/app-state-context'
import css from './index.module.css'

function CommandBar({}, ref: React.Ref<HTMLInputElement>) {

	const { command, commandActive, commandIsPending, commandIsValid, executeCommand, setCommand } = useContext(AppStateContext)

	const handleCommandBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommand(e.target.value)
		if (e.target.value === '') {
			executeCommand('/reset')
		}
	}

	const handleCommandBarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case 'Enter':
				executeCommand(command)
				break
			case 'Escape':
				executeCommand('/reset')
				break
		}
	}

	return (
		<div className={css.commandBar}>
			<input type="text" value={command} onChange={handleCommandBarChange} onKeyDown={handleCommandBarKeyDown} ref={ref} />
			{commandActive && !commandIsPending && !commandIsValid && <div className={css.commandBarError}>Invalid command</div>}
		</div>
	)
}

export default React.forwardRef<HTMLInputElement/*, CommandBarProps*/>(CommandBar)