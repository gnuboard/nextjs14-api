import React, { useState } from 'react';
import { MenuItem, Menu, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export function ActionMenu({
  submitListDelete,
  submitListCopy,
  setOpen,
  subCheckboxes,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {submitListDelete(subCheckboxes); handleClose();}}>
          일괄삭제
        </MenuItem>
        <MenuItem onClick={() => {
          submitListCopy(subCheckboxes);
          setOpen(true);
          handleClose();
        }}>
          선택복사
        </MenuItem>
        <MenuItem onClick={handleClose}>
          선택이동
        </MenuItem>
      </Menu>
    </>
  );
}