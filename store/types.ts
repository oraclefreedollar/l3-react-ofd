import { store } from 'store/store'

export type AppDispatch = typeof store.dispatch
// types
export type RootState = ReturnType<typeof store.getState>

export type ThunkConfig = { dispatch: AppDispatch; state: RootState }
