import { createContext, useReducer, ReactNode } from "react"

interface AppState {
	command: string
	searchActive: boolean
	commandActive: boolean
	editFormVisible: boolean
	editFormMode: EditFormMode,
	showAll: boolean
	editMode: boolean
	setCommand: (cmd: string) => void
	executeCommand: (cmd: string) => void
}

interface AppStateProviderProps {
	children: ReactNode;
}

const enum ActionType {
	SetCommand,
	ShowEditForm,
	Reset,
	ShowAll,
	SetEditMode
}

const enum EditFormMode {
	Add,
	Edit
}

type Action = {
	type: ActionType,
	payload?: any
}

const initialState: AppState = {
	command: "",
	searchActive: false,
	commandActive: false,
	editFormVisible: false,
	editFormMode: EditFormMode.Add,
	showAll: false,
	editMode: false,
	setCommand: () => { },
	executeCommand: (cmd: string) => { console.log(cmd) },
}

const reducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case ActionType.SetCommand:
			return {
				...state,
				command: action.payload,
				searchActive: action.payload !== "" && !action.payload.startsWith("/"),
				commandActive: action.payload.startsWith("/"),
			}
		case ActionType.ShowEditForm:
			return { ...state, editFormVisible: true }
		case ActionType.Reset:
			return { ...state, ...initialState }
		case ActionType.ShowAll:
			return { ...state, showAll: true, editMode: false }
		case ActionType.SetEditMode:
			return { ...state, editMode: action.payload, showAll: action.payload }
		default:
			return state
	}
}

const AppStateContext = createContext<AppState>(initialState);

const AppStateProvider = ({ children }: AppStateProviderProps) => {

	const [state, dispatch] = useReducer(reducer,initialState)

	const setCommand = (cmd: string) => {
		dispatch({ type: ActionType.SetCommand, payload: cmd })
	}

	const executeCommand = (cmd: string) => {
		switch (cmd) {
			case "/add":
				dispatch({ type: ActionType.ShowEditForm, payload: { state: true, mode: EditFormMode.Add } })
				break
			case "/reset":
				dispatch({ type: ActionType.Reset })
				break
			case "/list":
				dispatch({ type: ActionType.ShowAll })
				break
			case "/edit":
				dispatch({ type: ActionType.SetEditMode, payload: true })
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

export default AppStateProvider
export { AppStateContext }