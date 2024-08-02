// src/app/(board)/board/[bo_table]/List.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { truncateText, formatDate } from '@/utils/commonUtils';
import { useSearchParams } from 'next/navigation';

function ListWrites({ board, writes, subCheckboxes, setSubCheckboxes }) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const [mainChecked, setMainChecked] = useState(false);

  const handleMainCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setMainChecked(isChecked);

    const updatedSubCheckboxes = Object.fromEntries(
      Object.keys(subCheckboxes).map(key => [key, isChecked])
    );

    setSubCheckboxes(updatedSubCheckboxes);
  };

  const handleSubCheckboxChange = (id) => {
    setSubCheckboxes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const maxLengthSubject = window.innerWidth < 640 ? 20 : window.innerWidth < 768 ? 25 : 35;
  const maxLengthName = window.innerWidth < 640 ? 5 : window.innerWidth < 768 ? 6 : 10;

  return (
    <div className="w-full">
      <ul className="w-full">
        {/* Header Row */}
        <li className="flex items-center py-2 border-b">
          <div className="w-8 mr-5">
            <input type="checkbox" checked={mainChecked} onChange={handleMainCheckboxChange} />
          </div>
          <div className="flex-1 text-sm">
            제목
          </div>
          <div className="hidden sm:block w-20 text-sm">
            작성자
          </div>
          <div className="w-20 text-sm">
            날짜
          </div>
        </li>
        {/* Data Rows or No Data Message */}
        {writes.length === 0 ? (
          <li className="py-2 text-center">
            <p className="text-sm">게시물이 없습니다.</p>
          </li>
        ) : (
          writes.map((write) => (
            <React.Fragment key={write.wr_id}>
              <li className="flex items-start py-2 border-b">
                <div className="w-8 mr-5">
                  <input type="checkbox" id={write.wr_id} checked={subCheckboxes[write.wr_id]} onChange={() => handleSubCheckboxChange(write.wr_id)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center text-sm">
                    <Link href={`/board/${board.bo_table}/${write.wr_id}?${query}`} passHref>
                      {write.wr_option.includes('secret') ? <span className="material-icons text-gray-500 text-xs">lock</span> : ''}
                      {truncateText(write.wr_subject, maxLengthSubject)}
                    </Link>
                    {write.wr_comment > 0 && <span className="ml-1 text-xs text-gray-500">[{write.wr_comment}]</span>}
                  </div>
                </div>
                <div className="hidden sm:block w-20 text-xs text-gray-500">
                  {truncateText(write.wr_name, maxLengthName)}
                </div>
                <div className="w-20 text-xs text-gray-500">
                  {formatDate(write.wr_datetime)}
                </div>
              </li>
            </React.Fragment>
          ))
        )}
      </ul>
    </div>
  );
}

export default ListWrites;
