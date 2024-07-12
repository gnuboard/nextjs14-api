// src/app/(board)/board/[bo_table]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import ListWrites from './List';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Search from './Search';
import './pagination.css';
import { Typography, Button } from '@mui/material';
import { useAuth } from '@/components/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

async function fetchListWrites(bo_table, sst, sod, sfl, stx, sca, page, per_page) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/boards/${bo_table}/writes`;
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
    const response = await axios.get(url, { params });
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
  const sst = 'wr_num, wr_reply'; // 기본 정렬 필드
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

  const { isLogin } = useAuth();

  useEffect(() => {
    const loadWrites = async () => {
      const data = await fetchListWrites(bo_table, sst, sod, sfl, stx, sca, currentPage, per_page);
      setWrites(data.writes);
      setBoard(data.board || {});
      setTotalRecords(data.total_records);
      setTotalPages(data.total_pages);
    };

    loadWrites();
  }, [bo_table, currentPage, sst, sod, sfl, stx, sca, per_page]);

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
    <div>
      <Typography variant="h4" gutterBottom>{board.bo_subject}</Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Search 
          sfl={sfl} 
          stx={stx} 
          onSflChange={(value) => handleFieldChange('sfl', value)} 
          onStxChange={(value) => handleFieldChange('stx', value)} 
          onSubmit={handleSearchSubmit} 
          isLogin={isLogin} 
        />
        <Button variant="contained" color="primary" onClick={handleWriteClick}>
          글쓰기
        </Button>
      </div>
      <ListWrites writes={writes} board={board} />
      <ReactPaginate
        initialPage={currentPage - 1} // Set the initial page correctly
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
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
