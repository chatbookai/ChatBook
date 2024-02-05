// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

interface DataParams {
  pageId: number
  pageSize: number
}

// ** Fetch Data
export const fetchData = createAsyncThunk('appBlocks/fetchData', async (params: DataParams) => {
  const response = await axios.get(authConfig.backEndApiChatBook + '/knowledge/'+ `${params.pageId}` + '/'+params.pageSize)
  
  const NewData: any[] = response.data.data.filter((record: any) => record.id)
  response.data.data = NewData
  
  return response.data
})

export const appBlocksSlice = createSlice({
  name: 'appBlocks',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
    })
  }
})

export default appBlocksSlice.reducer
