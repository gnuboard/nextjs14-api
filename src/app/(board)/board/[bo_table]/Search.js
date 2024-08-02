// app/(board)/board/[bo_table]/Search.js
import React from 'react';

export default function Search({ sfl, stx, onSflChange, onStxChange, onSubmit }) {
  return (
    <form className="flex items-center gap-2 mt-3" onSubmit={onSubmit}>
      <div className="relative">
        <select
          value={sfl}
          onChange={(e) => onSflChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="wr_subject">제목</option>
          <option value="wr_content">내용</option>
          <option value="wr_subject||wr_content">제목+내용</option>
          <option value="mb_id,1">회원아이디</option>
          <option value="mb_id,0">회원아이디(코)</option>
          <option value="wr_name,1">글쓴이</option>
          <option value="wr_name,0">글쓴이(코)</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zM4 9a1 1 0 100 2h8a1 1 0 100-2H4z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <input 
        type="text" 
        value={stx} 
        onChange={(e) => onStxChange(e.target.value)} 
        placeholder="검색어"
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <button 
        type="submit" 
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm"
      >
        검색
      </button>
    </form>
  );
}
