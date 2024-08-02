// @/components/Latest.js

"use client";

import React, { useEffect, useState } from 'react';
import { truncateText, formatDate } from '@/utils/commonUtils';
import Link from 'next/link';
import { fetchBoardDataRequest } from '@/app/axios/server_api';

// 작성자 이니셜을 얻는 함수
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const Latest = ({ bo_table, per_page }) => {
  const [boardData, setBoardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBoardDataRequest(bo_table, { per_page });
        const data = response.data;
        if (data) {
          setBoardData(data);
        } else {
          console.error('API response data is not in the expected format:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [bo_table, per_page]);

  if (!boardData) {
    return (
      <div className="text-center py-4">
        <span className="text-sm">로딩중이거나 데이터가 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="mt-2 p-4 bg-white shadow rounded">
      <Link href={`/board/${bo_table}`} passHref>
        <h2 className="text-2xl font-bold mb-2 cursor-pointer">{boardData.board.bo_subject}</h2>
      </Link>
      {boardData.writes.length > 0 ? (
        <ul>
          {boardData.writes.map((write) => (
            <li key={write.wr_id} className="flex justify-between items-center py-2 border-b last:border-b-0 cursor-pointer">
              <Link href={`/board/${bo_table}/${write.wr_id}`} passHref className="flex justify-between items-center w-full">
                <div className="flex items-center w-full">
                  <span className="text-sm font-medium mr-2">{truncateText(write.wr_subject, 20)}</span>
                  <span className="text-xs text-gray-500">{write.wr_comment > 0 && `[${write.wr_comment}]`}</span>
                  <span className="text-xs text-right text-gray-500 w-20">{formatDate(write.wr_datetime)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4">
          <span className="text-sm">로딩중이거나 데이터가 없습니다.</span>
        </div>
      )}
    </div>
  );
};

export default Latest;
