import { useReducer } from "react"

type UIState = {
	command: string
	addFormVisible: boolean
	showAll: boolean
}

const initialState: UIState = {
	command: "",
	addFormVisible: false,
	showAll: false,
}

type Action = {
	type: "SET_COMMAND" | "SHOW_ADD_FORM" | "RESET" | "SHOW_ALL",
	payload?: any
}

const reducer = (state: UIState, action: Action): UIState => {
	switch (action.type) {
		case "SET_COMMAND":
			return { ...state, command: action.payload }
		case "SHOW_ADD_FORM":
			return { ...state, addFormVisible: true }
		case "RESET":
			return { ...state, command: "", addFormVisible: false, showAll: false }
		case "SHOW_ALL":
			return { ...state, showAll: true }
		default:
			return state
	}
}

export const useUIState = () => {

	const [state, dispatch] = useReducer(reducer, initialState)

	const executeCommand = (cmd: string) => {
		switch (cmd) {
			case "/add":
				dispatch({ type: "SHOW_ADD_FORM", payload: true })
				break
			case "/reset":
			case "/r":
				dispatch({ type: "RESET" })
				break
			case "/ls":
				dispatch({ type: "SHOW_ALL" })
				break
			default:
				break
		}
	}

	return {
		command: state.command,
		searchActive: state.command !== "" && !state.command.startsWith("/"),
		commandActive: state.command.startsWith("/"),
		addFormVisible: state.addFormVisible,
		showAll: state.showAll,
		setCommand: (cmd: string) => dispatch({ type: "SET_COMMAND", payload: cmd }),
		executeCommand,
	}
}


