import { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from 'react'
import { loadState, saveState, defaultState } from '../lib/storage'
import { currentPeriod, uid } from '../lib/finance'

const DataContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'replace':
      return action.payload
    case 'patchSettings':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'setOnboarded':
      return { ...state, onboarded: true }
    case 'add':
      return { ...state, [action.key]: [{ id: uid(), ...action.item }, ...state[action.key]] }
    case 'update':
      return {
        ...state,
        [action.key]: state[action.key].map((x) =>
          x.id === action.id ? { ...x, ...action.patch } : x
        ),
      }
    case 'remove':
      return { ...state, [action.key]: state[action.key].filter((x) => x.id !== action.id) }
    case 'setFixedStatus':
      return { ...state, fixedStatus: { ...state.fixedStatus, [action.compositeKey]: action.value } }
    case 'reset':
      return defaultState()
    default:
      return state
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const period = useMemo(
    () => currentPeriod(state.settings.monthStartDay),
    [state.settings.monthStartDay]
  )

  // Generic CRUD helpers bound to a collection key
  const crud = useCallback(
    (key) => ({
      add: (item) => dispatch({ type: 'add', key, item }),
      update: (id, patch) => dispatch({ type: 'update', key, id, patch }),
      remove: (id) => dispatch({ type: 'remove', key, id }),
      duplicate: (id) => {
        const item = state[key].find((x) => x.id === id)
        if (item) {
          // eslint-disable-next-line no-unused-vars
          const { id: _omit, ...rest } = item
          dispatch({ type: 'add', key, item: rest })
        }
      },
    }),
    [state]
  )

  const value = useMemo(
    () => ({
      state,
      period,
      dispatch,
      settings: state.settings,
      patchSettings: (p) => dispatch({ type: 'patchSettings', payload: p }),
      setOnboarded: () => dispatch({ type: 'setOnboarded' }),
      reset: () => dispatch({ type: 'reset' }),
      replace: (payload) => dispatch({ type: 'replace', payload }),
      expenses: crud('expenses'),
      income: crud('income'),
      budgets: crud('budgets'),
      goals: crud('goals'),
      fixed: crud('fixed'),
      setFixedStatus: (compositeKey, value) =>
        dispatch({ type: 'setFixedStatus', compositeKey, value }),
    }),
    [state, period, crud]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext)
