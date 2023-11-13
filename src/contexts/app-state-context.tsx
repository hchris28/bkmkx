import { createContext, useReducer, ReactNode } from "react"

interface AppState {
	command: string
	searchActive: boolean
	commandActive: boolean
	addFormVisible: boolean
	showAll: boolean
	editMode: boolean
	setCommand: (cmd: string) => void
	executeCommand: (cmd: string) => void
}

interface AppStateProviderProps {
	children: ReactNode;
}

type Action = {
	type: "SET_COMMAND" | "SHOW_ADD_FORM" | "RESET" | "SHOW_ALL" | "SET_EDIT_MODE",
	payload?: any
}

const reducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case "SET_COMMAND":
			return { 
				...state, 
				command: action.payload,
				searchActive: action.payload !== "" && !action.payload.startsWith("/"),
				commandActive: action.payload.startsWith("/"), 
			}
		case "SHOW_ADD_FORM":
			return { ...state, addFormVisible: true }
		case "RESET":
			return { ...state, command: "", addFormVisible: false, showAll: false }
		case "SHOW_ALL":
			return { ...state, showAll: true }
		case "SET_EDIT_MODE":
			return { ...state, editMode: action.payload }
		default:
			return state
	}
}

export const AppStateContext = createContext<any>(null);

const AppStateProvider = ({ children }: AppStateProviderProps) => {

	const [state, dispatch] = useReducer(reducer, {
		command: "",
		searchActive: false,
		commandActive: false,
		addFormVisible: false,
		showAll: false,
		editMode: false,
		setCommand: () => { },
		executeCommand: () => { },
	})

	const setCommand = (cmd: string) => {
		dispatch({ type: "SET_COMMAND", payload: cmd })
	}

	const executeCommand = (cmd: string) => {
		switch (cmd) {
			case "/add":
				dispatch({ type: "SHOW_ADD_FORM", payload: true })
				break
			case "/reset":
				dispatch({ type: "RESET" })
				break
			case "/list":
				dispatch({ type: "SHOW_ALL" })
				break
			case "/edit":
				dispatch({ type: "SET_EDIT_MODE", payload: true })
				break
			default:
				break
		}
	}

	return (
		<AppStateContext.Provider value={{
			...state,
			setCommand,
			executeCommand
		}}>
			{children}
		</AppStateContext.Provider>
	);
};

export default AppStateProvider;