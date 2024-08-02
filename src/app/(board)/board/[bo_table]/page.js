// src/app/(board)/board/[bo_table]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import ListWrites from './List';
import ReactPaginate from 'react-paginate';
import Search from './Search';
import './pagination.css';
import { useAuth } from '@/components/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  fetchWriteListRequest, deleteWriteListRequest,
  fetchActionBoardListRequest, executeActionBoardRequest,
} from '@/app/axios/server_api';
import { ActionMenu } from '@/components/Dropdown';
import { BoardSelectionModal } from '@/components/ActionBoards';

async function fetchListWrites(bo_table, sst, sod, sfl, stx, sca, page, per_page) {
  const params = {
    sst,
    sod,
    sfl,
    stx,
    sca,
    page,
    per_page,
  };

  try {
    const response = await fetchWriteListRequest(bo_table, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching board writes:', error);
    return { writes: [], total_records: 0, total_pages: 0, current_page: 0 };
  }
}

export default function ListWritesPage({ params }) {
  const { bo_table } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  // const sst = 'wr_num, wr_reply'; // 기본 정렬 필드
  const sst = '';
  const sod = 'and'; // 정렬 순서
  const initialSfl = searchParams.get('sfl') || 'wr_subject';
  const initialStx = searchParams.get('stx') || '';
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const sca = ''; // 검색 분류
  const per_page = 10; // 페이지 당 결과 수

  const [sfl, setSfl] = useState(initialSfl); // 검색 필드
  const [stx, setStx] = useState(initialStx); // 검색어
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [writes, setWrites] = useState([]);
  const [board, setBoard] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [subCheckboxes, setSubCheckboxes] = useState({});
  const [actionExectued, setActionExectued] = useState(false);
  const [open, setOpen] = useState(false);
  const [boardList, setBoardList] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [action, setAction] = useState('');

  const { isLogin } = useAuth();

  const initCheckedStatus = (writes) => {
    const subCheckboxes = {};
    writes.forEach((write) => {
      subCheckboxes[write.wr_id] = false;
    });
    return subCheckboxes;
  };

  const submitListDelete = async (subCheckboxes) => {
    const confirmDelete = confirm('선택한 글 목록을 삭제하시겠습니까?');
    if (!confirmDelete) {
      return;
    }

    const checkedList = [];
    for (const [id, checked] of Object.entries(subCheckboxes)) {
      if (checked) {
        checkedList.push(id);
      }
    }

    try {
      await deleteWriteListRequest(bo_table, checkedList);
    } catch (error) {
      console.error('Error deleting writes:', error);
      if (error.response.status === 401) {
        alert('관리자 로그인이 필요합니다.');
      } else if (error.response.status === 403) {
        alert('관리자만 일괄 삭제 기능을 사용할 수 있습니다.');
      }
    } finally {
      setActionExectued(!actionExectued);
    }
  };

  const submitListAction = async (subCheckboxes, action) => {
    const checkedBoxes = [];
    for (const [id, checked] of Object.entries(subCheckboxes)) {
      if (checked) {
        checkedBoxes.push(id);
      }
    }
    setCheckedList(checkedBoxes);

    try {
      const response = await fetchActionBoardListRequest(bo_table, action);
      setBoardList(response.data);
      setAction(action);
    } catch (error) {
      console.error('Error copying writes:', error);
    }
  };

  const handleSubmit = async (selectedBoards) => {
    const checkedListString = checkedList.join(',');
    const dataToSend = {
      wr_ids: checkedListString,
      target_bo_tables: selectedBoards,
    };

    try {
      const response = await executeActionBoardRequest(bo_table, action, dataToSend);
      if (response.status === 200) {
        alert(response.data.result);
      }
    } catch (error) {
      alert(error);
      console.error('Error copying writes:', error);
    } finally {
      setActionExectued(!actionExectued);
    }
  };

  useEffect(() => {
    const loadWrites = async () => {
      const data = await fetchListWrites(bo_table, sst, sod, sfl, stx, sca, currentPage, per_page);
      setWrites(data.writes);
      setBoard(data.board || {});
      setTotalRecords(data.total_records);
      setTotalPages(data.total_pages);
      setSubCheckboxes(initCheckedStatus(data.writes));
    };

    loadWrites();
  }, [bo_table, currentPage, sst, sod, sfl, stx, sca, per_page, actionExectued]);

  const updateQueryAndLoadWrites = (newPage, newSfl, newStx) => {
    const queryParams = new URLSearchParams({ sfl: newSfl, stx: newStx, page: newPage.toString() });
    router.replace(`/board/${bo_table}?${queryParams.toString()}`);
    setCurrentPage(newPage);
    setSfl(newSfl);
    setStx(newStx);
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    updateQueryAndLoadWrites(newPage, sfl, stx);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateQueryAndLoadWrites(1, sfl, stx);
  };

  const handleFieldChange = (field, value) => {
    if (field === 'sfl') {
      updateQueryAndLoadWrites(1, value, stx);
    } else if (field === 'stx') {
      updateQueryAndLoadWrites(1, sfl, value);
    }
  };

  const handleWriteClick = () => {
    router.push(`/board/${bo_table}/write`);
  };

  return (
    <div className="container mx-auto px-4 w-full">
      <h4 className="text-xl font-bold mb-2">{board.bo_subject}</h4>
      <div className="flex justify-between items-center mb-2">
        <Search
          sfl={sfl}
          stx={stx}
          onSflChange={(value) => handleFieldChange('sfl', value)}
          onStxChange={(value) => handleFieldChange('stx', value)}
          onSubmit={handleSearchSubmit}
          isLogin={isLogin}
        />
        <div>
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm"
            onClick={handleWriteClick}
          >
            글쓰기
          </button>
          <ActionMenu
            submitListDelete={submitListDelete}
            submitListAction={submitListAction}
            setOpen={setOpen}
            subCheckboxes={subCheckboxes}
          />
        </div>
      </div>
      <div>
        <BoardSelectionModal
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          boardList={boardList}
          selectedBoards={selectedBoards}
          setSelectedBoards={setSelectedBoards}
          action={action}
        />
      </div>
      <ListWrites
        writes={writes}
        board={board}
        subCheckboxes={subCheckboxes}
        setSubCheckboxes={setSubCheckboxes}
      />
      <ReactPaginate
        initialPage={currentPage - 1} // Set the initial page correctly
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={handlePageClick}
        containerClassName={'pagination flex justify-center mt-2'}
        activeClassName={'active'}
        previousLabel={'이전'}
        nextLabel={'다음'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        renderOnZeroPageCount={null}
      />
    </div>
  );
}
