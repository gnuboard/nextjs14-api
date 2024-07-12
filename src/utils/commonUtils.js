// src/utils/commonUtils.js

import dayjs from 'dayjs';

export function formatDate(dateString) {
  const date = dayjs(dateString);
  const today = dayjs();

  if (date.isSame(today, 'day')) {
    return date.format('HH:mm:ss');
  } else {
    return date.format('YY-MM-DD');
  }
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

export function get_img_url (bf_file) {
  if (!bf_file) {
    return "";
  }
  if (bf_file.startsWith("/")) {
    bf_file = bf_file.slice(1);
  }
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${bf_file}`;
}