import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

const initialState = {
  title: '',
  shortDescription: '',
  text: '',
  tags: [{ id: nanoid(), value: '' }],
};

const articleSlice = createSlice({
  name: 'article',
  initialState,
});

export default articleSlice.reducer;
