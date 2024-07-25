import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 초기 상태 정의
const initialState = {
    comments: {},
    loading: false,
    error: null,
};
/*
const initialState = {
    comments: {
        // boardId: 1인 경우의 초기 댓글 데이터
        1: [
          {
            id: 1,
            board_id: 1,
            repl_author_id: 201,
            content: '이것은 초기 댓글입니다.',
            writeday: new Date().toISOString().split('T')[0], // 오늘 날짜
            replies: [
              {
                id: 101,
                board_id: 1,
                repl_author_id: 202,
                content: '이것은 초기 대댓글입니다.',
                writeday: new Date().toISOString().split('T')[0], // 오늘 날짜
              }
            ],
          }
        ],
        5: [
        {
            id: 8,
            board_id: 5,
            repl_author_id: 'rbfl8484@gmail.com',
            content: '이것은 초기 댓글입니다.',
            writeday: new Date().toISOString().split('T')[0], // 오늘 날짜
            replies: [
                {
                id: 8,
                board_id: 5,
                repl_author_id: 202,
                content: '이것은 초기 대댓글입니다.',
                writeday: new Date().toISOString().split('T')[0], // 오늘 날짜
                }
            ],
            }
        ],
      },
    };
*/

// 댓글 목록을 가져오는 thunk
export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async (boardId) => {
      const response = await axios.get(`http://localhost:8080/comment/${boardId}`);
      console.log(JSON.stringify(response.data, null, 2)); // 댓글정보 로딩 확인
      // 댓글 데이터 정보 추출
        const comments = response.data.map(comment => ({
            id: comment.id,
            board_id: comment.boardId,
            replAuthorId: comment.replAuthorId,
            replContent: comment.replContent, // 백엔드에서 사용하는 이름 그대로 사용
            writeday: comment.writeday
        }));

        return { boardId, comments };
    }
);


// 댓글 추가를 위한 thunk
export const addComment = createAsyncThunk(
  'comments/addComment',
  async (commentData) => {
    const response = await axios.post('http://localhost:8080/comment', commentData);
    return response.data;
    /*
    return {
      id: response.data.id,
      board_id: response.data.board_id,
      replAuthorId: response.data.replAuthorId,
      replContent: response.data.replContent, // 백엔드에서 사용하는 이름 그대로 사용
      writeday: response.data.writeday
    };
*/
  }
);

// 댓글 삭제를 위한 thunk
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId) => {
    await axios.delete(`http://localhost:8080/comment/${commentId}`);
    return commentId;
  }
);

// 댓글 수정을 위한 thunk

/*
export const updateComment = createAsyncThunk(
    'comments/updateComment',
    async (commentData) => {
        const { id, ...rest } = commentData;
        const response = await axios.put(`http://localhost:8080/comment/${id}`, rest);
        return response.data;
    }
);

 */
//
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async (updatedComment) => {
    const { id, ...updatedData } = updatedComment;
    const response = await axios.put(`http://localhost:8080/comment/${id}`, {
      ...updatedData,
        replContent: updatedData.replContent // 백엔드에서 사용하는 이름 그대로 사용
    });
    return {
      id: response.data.id,
      board_id: response.data.board_id,
        replAuthorId: response.data.replAuthorId,
        replContent: response.data.replContent,
      writeday: response.data.writeday
    };
  }
);
//

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchComments.fulfilled, (state, action) => {
            const { boardId, comments } = action.payload;
            state.comments[boardId] = comments;
        })
        /*
        .addCase(fetchComments.fulfilled, (state, action) => {
            console.log('Fetch Comments Fulfilled:', action.payload); // 응답 확인
            const { boardId, comments } = action.payload;
            state.comments[boardId] = comments.map(comment => ({
                id: comment.id,
                board_id: comment.board_id,
                repl_author_id: comment.repl_author_id,
                content: comment.repl_content,
                writeday: comment.writeday
            })) || [];
        })
         */
        .addCase(addComment.fulfilled, (state, action) => {
            const { boardId, ...newComment } = action.payload;
            if (!state.comments[boardId]) {
                state.comments[boardId] = [];
            }
            state.comments[boardId].push(newComment);
        })
        /*
      .addCase(addComment.fulfilled, (state, action) => {
        console.log('Add Comment Fulfilled:', action.payload); // 응답 확인
        const { board_id, id, content, repl_author_id, writeday } = action.payload;
        if (!state.comments[board_id]) {
          state.comments[board_id] = [];
        }
        state.comments[board_id].push({
          id,
          board_id,
          repl_author_id,
          content,
          writeday
        });
      })

         */
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        Object.keys(state.comments).forEach(boardId => {
          if (state.comments[boardId]) {
            state.comments[boardId] = state.comments[boardId].filter(comment => comment.id !== commentId);
          }
        });
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        Object.keys(state.comments).forEach(boardId => {
          if (state.comments[boardId]) {
            const index = state.comments[boardId].findIndex(comment => comment.id === updatedComment.id);
            if (index !== -1) {
              state.comments[boardId][index] = updatedComment;
            }
          }
        });
      });
  },
});

export default commentsSlice.reducer;
