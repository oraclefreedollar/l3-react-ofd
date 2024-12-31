import { DefaultError, QueryObserverResult, RefetchOptions } from '@tanstack/react-query'

export type RefetchType = (options?: RefetchOptions) => Promise<QueryObserverResult<unknown, DefaultError>>
